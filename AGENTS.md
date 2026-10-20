
AGENTS.md – Project Guide for AI Coding Assistants (Clover AirBridge)
Last updated: 2025-06-28

0. Mission
Your primary mission is to build and maintain the Clover AirBridge Android application. This app transforms a Clover Station Solo into a payment orchestrator, enabling it to initiate transactions that are completed on a separate Clover Flex 4 device over a local network.

Your goal is to ensure the app adheres to the "Station-as-Orchestrator" architecture, correctly using a hybrid of the Clover Android SDK and the Remote Pay Android SDK to create a seamless, robust, and compliant payment flow.

Key Architectural Principle: The app runs on the Station Solo. It does not run on a Clover Mini, and it does not intercept USB traffic.

1. Architecture & Core Components
The application is a native Android app that leverages two distinct Clover SDKs.

Custom Tender (Clover Android SDK):

The app registers an <activity> in AndroidManifest.xml with an <intent-filter> for the clover.intent.action.PAY action. This makes it appear as a custom payment tender in the Clover Register app.

When launched, this activity receives the orderId via the Intent extras.

It uses the OrderConnector to connect to local Clover services and retrieve the order details, specifically the total amount.

Remote Payment (Remote Pay Android SDK):

The app acts as a Point-of-Sale (POS) client.

It uses the CloverConnector to establish a WebSocket Secure (WSS) connection to the Secure Network Pay Display (SNPD) app running on the Clover Flex.

It creates and sends a SaleRequest containing the order total to the Flex.

It listens for the SaleResponse using an ICloverConnectorListener implementation.

Workflow Orchestration (PaymentRelayActivity.kt):

This is the central component that ties the two SDKs together.

It is launched by the PAY intent.

It uses a CloverFlexManager helper class to handle the complexities of the remote connection.

Based on the SaleResponse from the Flex, it sets its own result (Activity.RESULT_OK or Activity.RESULT_CANCELED) and finishes, returning control to the Clover Register app.

2. Environment & Build Configuration
Target Device: Clover Station Solo

Target Android API Level: minSdkVersion 29, targetSdkVersion 34 (compileSdkVersion 34)

targetSdkVersion note (2026-10-20): the target was raised from 29 to 34 because the CI `./gradlew build`
runs lint, whose `ExpiredTargetSdkVersion` error fails the build at 29. It is not suppressed. Behaviour
gated on targetSdk applies only on a device whose own Android API level is at or above that gate, so on
minSdk-era Clover hardware the bump mostly compiles in stricter checks (explicit `android:exported`,
PendingIntent mutability). A green `./gradlew build` shows those compile; it is not a runtime test. The
owner's manual device pass on a Station Solo and Flex stays the final gate for runtime behaviour.

Manifest note (2026-10-20): lint `MissingClass` caught that `AndroidManifest.xml` registered
`.relay.PaymentRelayActivity`, which resolves under the `com.pcnaid.cloverairbridge` namespace, while the
class lives in `com.clover.airbridge.relay`. The activity would have failed to launch. It is registered by
its fully qualified name; keep it that way unless the source package moves.

Language: Kotlin

Build Tool: Gradle

app/build.gradle Dependencies:
Ensure the following dependencies are present:

// For native integration and custom tender
implementation 'com.clover.sdk:clover-android-sdk:329'

// For remote communication with Clover Flex
implementation 'com.clover.sdk:remote-pay-android-connector:5.0.0'

// Baseline note (2026-10-20): the originally specified clover-android-sdk:327 and
// remote-pay-android-connector:5.0.1 cannot be fetched. Maven Central returns 404 for
// clover-android-sdk-327.pom and remote-pay-android-connector-5.0.1.pom; its metadata lists
// clover-android-sdk 328-341 and remote-pay-android-connector 4.3.x-5.0.0 (5.0.1 was never published
// there), and the former sdk.clover.com repository no longer resolves. 5.0.0 is the newest published
// connector and its POM declares clover-android-sdk:329 as a runtime dependency, so the SDK is declared
// at 329 to keep the compiled and packaged versions identical. The only repository is mavenCentral().

// For asynchronous operations
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3'
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'

3. Critical Invariants & Logic Flow (❗ DO NOT BREAK)
Intent Handling: The PaymentRelayActivity must correctly retrieve the orderId from the incoming PAY Intent using intent.getStringExtra(Intents.EXTRA_ORDER_ID). Handle the case where the orderId is null by failing gracefully.

Order Total Retrieval: Use the OrderConnector to fetch the Order object. The order.total property contains the amount to be charged. This operation must be performed on a background thread.

RAID Configuration: The CloverConnector must be initialized with the correct Remote App ID (RAID). This ID is generated in the Developer Dashboard and must be stored securely or as a build constant. For example, in AppConstants.kt:
const val REMOTE_APP_ID = "YOUR_REMOTE_APP_ID_HERE"

Flex Connection: The WebSocketCloverTransport must be configured with the correct IP address and port of the Clover Flex running the SNPD app. This should be made configurable for the merchant.

External Payment ID: Every SaleRequest sent to the Flex must have a unique externalId (UUID.randomUUID().toString()). This is critical for transaction tracking and reconciliation.

Response Handling: The onSaleResponse callback is the single source of truth for the transaction outcome.

If response.isSuccess() is true, the payment was successful. The app must call setResult(Activity.RESULT_OK) before finishing.

If response.isSuccess() is false, the payment failed or was canceled. The response.reason should be logged or displayed. The app must call setResult(Activity.RESULT_CANCELED) before finishing.

Resource Management: Both the OrderConnector and the CloverConnector must be properly disposed of in the onDestroy() lifecycle method of the activity (orderConnector.disconnect() and cloverConnector.dispose()).

4. Testing & Deployment
Sideloading Protocol (Mandatory)
Due to Clover's security model, a developer-signed APK cannot be installed over a version downloaded from the App Market. Follow this procedure:

Install from Market First: Install the app on the Station Solo from the More Tools app once. This registers the app's permissions.

Uninstall via ADB: Connect the Station to your computer and run:

adb uninstall com.pcnaid.cloverairbridge

Sideload Dev Build: Now, install your debug/development APK:

adb install path/to/your/app-debug.apk

Test Plan
A full end-to-end test must validate the following:

Successful Payment: The order is marked as paid in the Register app.

Canceled Payment: The customer cancels on the Flex; the Register app returns to the payment selection screen, and the order remains open.

Declined Payment: A card is declined on the Flex; the Register app returns to the payment selection screen.

Network Disconnection: The app gracefully handles cases where the Flex is unreachable (e.g., wrong IP, not on network, SNPD not running).

5. CI Blueprint (GitHub Actions)
Use this skeleton for any CI/CD workflows.

name: Android CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Grant execute permission for gradlew
        run: chmod +x ./gradlew
      - name: Build with Gradle
        run: ./gradlew build
      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk

6. Common Local Commands
# Sideload the debug build
./gradlew installDebug

# View logs from the app
adb logcat -s "CloverAirBridge"

# Uninstall the app
adb uninstall com.pcnaid.cloverairbridge

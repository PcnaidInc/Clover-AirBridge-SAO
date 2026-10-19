
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

Target Android API Level: 29 (minSdkVersion)

Language: Kotlin

Build Tool: Gradle

app/build.gradle Dependencies:
Ensure the following dependencies are present:

// For native integration and custom tender
implementation 'com.clover.sdk:clover-android-sdk:327'

// For remote communication with Clover Flex
implementation 'com.clover.sdk:remote-pay-android-connector:5.0.1'

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
The repository CI workflow is configured in `.github/workflows/ci.yml` and triggers on `push` and `pull_request` to `main`.
Permissions: `contents: read`.
Runner: `ubuntu-latest`.

The workflow runs the following checks:
- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

6. Common Local Commands
# Sideload the debug build
./gradlew installDebug

# View logs from the app
adb logcat -s "CloverAirBridge"

# Uninstall the app
adb uninstall com.pcnaid.cloverairbridge

# Clover-AirBridge

Clover AirBridge: Station-to-Flex Payment Orchestrator

## CI

This project runs the following checks on every pull request and on push to `main`, via the `.github/workflows/ci.yml` workflow:

- `npm run typecheck` — TypeScript type checking (`tsc --noEmit`)
- `npm run build` — Production build (`next build`)
- `android-build` — Gradle debug build of the Android app (`app/`)

This repository contains the source code for the Clover AirBridge, an Android application that enables a Clover Station Solo to initiate and orchestrate payments on a separate Clover Flex 4 device over a local network.

Overview
The purpose of this application is to allow a merchant to use a Clover Station Solo as their primary point-of-sale (POS) for order management, and then seamlessly hand off the payment process to a customer-facing Clover Flex.

This is achieved by installing a specialized Android application on the Station Solo. This app registers itself as a new payment method (a "custom tender") within the main Register app. When this tender is selected, our app takes control, communicates with the Flex over the local network to process the payment, and then returns the result to the Register app to finalize the order.

Note: This solution uses the Station Solo and Flex 4. A Clover Mini is not required for this workflow.

Architecture
This application functions as a "Station-as-Orchestrator," combining two Clover SDKs to achieve its goal:

Clover Android SDK (clover-android-sdk): Used to integrate with the native Clover environment on the Station Solo. This allows the app to be launched as a custom payment tender and to access local order data.

Remote Pay Android SDK (remote-pay-android-connector): Used to communicate with the Clover Flex 4. The app on the Station acts as a temporary POS, sending payment requests to the Flex over a secure WebSocket connection.

Hardware & Software Prerequisites
Clover Station Solo: Must be running the latest firmware. This is where the AirBridge app will be installed.

Clover Flex 4: Must be running the latest firmware.

Local Network: Both devices must be connected to the same stable Wi-Fi or Ethernet network.

Secure Network Pay Display (SNPD): This app must be installed on the Clover Flex 4 from the Clover App Market.

Setup and Installation Guide
Follow these steps to get the system running.

Step 1: Set Up the Clover Flex 4
Turn on your Clover Flex 4 and connect it to your local Wi-Fi network.

Open the More Tools app to access the Clover App Market.

Search for and install the Secure Network Pay Display app.

Launch the Secure Network Pay Display app.

On the startup screen, tap Start. The device will display its connection URL, which includes its IP address (e.g., wss://192.168.1.105:12345/remote_pay).

Take note of this IP address. You will need it to configure the app on the Station Solo.

Step 2: Set Up the Clover Developer Account
Log in to your sandbox Clover Developer Dashboard.

Create a new app for this integration.

In the app's settings, go to App Type.

Select "Yes" for the option "Is this app an integration of an existing point of sale?". This is critical as it will generate a Remote App ID (RAID).

Copy the generated RAID.

Go to Requested Permissions and enable Read Payments, Write Payments, Read Orders, and Write Orders.

Step 3: Build and Install the AirBridge App on the Station Solo
Open the Android project in Android Studio.

Navigate to the file AppConstants.kt.

Paste the RAID you copied from the Developer Dashboard into the REMOTE_APP_ID constant.

Update the FLEX_IP_ADDRESS constant with the IP address of your Clover Flex 4.

Build a signed release APK of the application.

Sideload the generated APK onto the Clover Station Solo using adb install. (Refer to Clover's documentation for enabling developer mode and sideloading).

Step 4: Run a Test Transaction
On the Station Solo, open the Register app.

Add one or more items to a new order.

Tap Pay. You will be taken to the payment selection screen.

You should now see a new button labeled "Pay on Flex" (or similar, depending on the tender_label in strings.xml). Tap it.

The AirBridge app will launch on the Station Solo, displaying a "Processing..." message.

The screen on the Clover Flex 4 will activate and display the total order amount, prompting the customer for payment.

Complete the payment on the Flex using a test card (dip, tap, or swipe).

Once the payment is approved on the Flex, the AirBridge app on the Station will close, and you will be returned to the Register app's receipt screen, with the order marked as paid.

Troubleshooting
"Pay on Flex" button is missing: The AirBridge app is likely not installed correctly on the Station Solo, or the AndroidManifest.xml intent filter is incorrect. Verify the installation via adb shell pm list packages.

App launches then immediately closes or crashes:

Check adb logcat for errors.

Ensure the orderId is being correctly received from the PAY intent.

Verify the app has the necessary permissions granted in the Developer Dashboard.

App is stuck on "Contacting Flex device...":

Double-check that the IP address in AppConstants.kt is correct.

Ensure the Flex and Station are on the same Wi-Fi/LAN network.

Verify that the Secure Network Pay Display app is running on the Flex and is on its "listening" screen.

Check for any network firewalls that might be blocking communication on port 12345.

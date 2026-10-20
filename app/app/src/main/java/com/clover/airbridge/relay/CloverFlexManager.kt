package com.clover.airbridge.relay

import android.content.Context
import com.clover.remote.client.CloverConnector
import com.clover.remote.client.DefaultCloverConnectorListener
import com.clover.remote.client.ICloverConnector
import com.clover.remote.client.MerchantInfo
import com.clover.remote.client.WebSocketCloverDeviceConfiguration
import com.clover.remote.client.messages.CloverDeviceErrorEvent
import com.clover.remote.client.messages.ConfirmPaymentRequest
import com.clover.remote.client.messages.ResultCode
import com.clover.remote.client.messages.SaleRequest
import com.clover.remote.client.messages.SaleResponse
import com.clover.remote.client.utils.WebSocketUtils
import kotlinx.coroutines.CompletableDeferred

class CloverFlexManager(context: Context) {

    private var cloverConnector: ICloverConnector? = null
    private var saleResponseDeferred: CompletableDeferred<SaleResponse>? = null

    init {
        val endpoint = WebSocketUtils.createSecureURI(AppConstants.FLEX_IP_ADDRESS, AppConstants.FLEX_PORT.toString())
        val config = object : WebSocketCloverDeviceConfiguration(
            endpoint,
            AppConstants.REMOTE_APP_ID,
            null,
            "Clover AirBridge",
            "AirBridge-POS-01",
            null
        ) {
            override fun onPairingCode(pairingCode: String?) {}
            override fun onPairingSuccess(authToken: String?) {}
        }
        cloverConnector = CloverConnector(config)
        cloverConnector?.addCloverConnectorListener(CloverListener())
    }

    suspend fun processPayment(amount: Long, externalId: String): SaleResponse {
        saleResponseDeferred = CompletableDeferred()
        cloverConnector?.initializeConnection()

        val saleRequest = SaleRequest(amount, externalId)
        saleRequest.setDisablePrinting(true)
        saleRequest.setDisableReceiptSelection(true)

        cloverConnector?.sale(saleRequest)
        return saleResponseDeferred!!.await()
    }

    fun dispose() {
        cloverConnector?.dispose()
    }

    private inner class CloverListener : DefaultCloverConnectorListener(cloverConnector) {
        override fun onSaleResponse(response: SaleResponse) {
            super.onSaleResponse(response)
            saleResponseDeferred?.complete(response)
        }

        // The device raises challenges (e.g. duplicate payment) for the merchant to confirm. This
        // unattended relay has nobody to confirm, so reject on any challenge and accept otherwise.
        override fun onConfirmPaymentRequest(request: ConfirmPaymentRequest) {
            val challenge = request.challenges?.firstOrNull()
            if (challenge != null) {
                cloverConnector?.rejectPayment(request.payment, challenge)
            } else {
                cloverConnector?.acceptPayment(request.payment)
            }
        }

        override fun onDeviceReady(merchantInfo: MerchantInfo) {
            super.onDeviceReady(merchantInfo)
        }

        override fun onDeviceError(deviceErrorEvent: CloverDeviceErrorEvent) {
            super.onDeviceError(deviceErrorEvent)
            val dummyResponse = SaleResponse(false, ResultCode.FAIL)
            dummyResponse.reason = "Device Error: ${deviceErrorEvent.message}"
            saleResponseDeferred?.complete(dummyResponse)
        }
    }
}

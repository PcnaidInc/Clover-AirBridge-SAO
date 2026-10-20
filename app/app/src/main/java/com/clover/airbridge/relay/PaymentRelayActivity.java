package com.clover.airbridge.relay;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.clover.sdk.v1.Intents;
import com.clover.sdk.v3.order.Order;
import com.clover.sdk.v3.order.OrderConnector;
import com.pcnaid.cloverairbridge.databinding.ActivityPaymentRelayBinding;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PaymentRelayActivity extends AppCompatActivity {

    private ActivityPaymentRelayBinding binding;
    private OrderConnector orderConnector;
    private String orderId;
    private CloverFlexManager cloverFlexManager;
    private static final String TAG = "PaymentRelayActivity";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityPaymentRelayBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        orderId = getIntent().getStringExtra(Intents.EXTRA_ORDER_ID);

        if (orderId == null) {
            showError("Error: No Order ID provided.");
            finishWithResult(Activity.RESULT_CANCELED);
            return;
        }

        orderConnector = new OrderConnector(this, CloverAccount.getAccount(this), null);
        orderConnector.connect();

        cloverFlexManager = new CloverFlexManager(this);

        executor.execute(this::processOrderPayment);
    }

    private void processOrderPayment() {
        try {
            Order order = orderConnector.getOrder(orderId);

            if (order == null || !order.hasTotal()) {
                runOnUiThread(() -> {
                    showError("Error: Could not retrieve order details.");
                    finishWithResult(Activity.RESULT_CANCELED);
                });
                return;
            }

            long amount = order.getTotal();
            String externalPaymentId = UUID.randomUUID().toString();

            runOnUiThread(() -> {
                binding.statusText.setText("Contacting Flex device...");
                binding.progressBar.setVisibility(View.VISIBLE);
            });

            cloverFlexManager.processPaymentAsync(amount, externalPaymentId, response ->
                runOnUiThread(() -> {
                    if (response.isSuccess()) {
                        recordExternalPayment(orderId, amount);
                        finishWithResult(Activity.RESULT_OK);
                    } else {
                        showError("Payment Failed: " + response.getReason());
                        finishWithResult(Activity.RESULT_CANCELED);
                    }
                })
            );
        } catch (RemoteException e) {
            runOnUiThread(() -> {
                showError("Error connecting to Clover services.");
                finishWithResult(Activity.RESULT_CANCELED);
            });
        } catch (Exception e) {
            runOnUiThread(() -> {
                showError("An unexpected error occurred: " + e.getMessage());
                finishWithResult(Activity.RESULT_CANCELED);
            });
        }
    }

    private void recordExternalPayment(String orderId, long amount) {
    try {
        Intent intent = new Intent("clover.intent.action.PAYMENT_PROCESSED");
        intent.putExtra("clover.intent.extra.ORDER_ID", orderId);
        intent.putExtra("clover.intent.extra.AMOUNT", amount);
        intent.putExtra("clover.intent.extra.PAYMENT_TYPE", "EXTERNAL");
        intent.putExtra("clover.intent.extra.NOTE", "Paid via AirBridge");
        startActivityForResult(intent, 100);
    } catch (Exception e) {
        Log.e(TAG, "Error recording external payment", e);
        setResult(RESULT_CANCELED);
        finish();
    }
}

    private void showError(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    private void finishWithResult(int resultCode) {
        setResult(resultCode);
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executor.shutdownNow();
        if (orderConnector != null) {
            orderConnector.disconnect();
        }
        if (cloverFlexManager != null) {
            cloverFlexManager.dispose();
        }
    }
}

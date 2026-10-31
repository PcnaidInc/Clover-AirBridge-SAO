package com.clover.airbridge.relay;

import android.content.Intent;
import com.clover.sdk.v1.Intents;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertEquals;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 34)
public class PaymentRelayActivityTest {

    @Test
    public void createTenderResultIntent_includesAmountAndClientId() {
        long amount = 1234L;
        String clientId = "client-5678";

        Intent data = PaymentRelayActivity.createTenderResultIntent(amount, clientId);

        assertEquals(amount, data.getLongExtra(Intents.EXTRA_AMOUNT, -1L));
        assertEquals(clientId, data.getStringExtra(Intents.EXTRA_CLIENT_ID));
    }
}

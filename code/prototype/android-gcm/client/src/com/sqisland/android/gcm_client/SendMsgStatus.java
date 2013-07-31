package com.sqisland.android.gcm_client;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import com.google.android.gcm.GCMRegistrar;

import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

public class SendMsgStatus extends Activity {
  private GCMReceiver mGCMReceiver;
  private IntentFilter mOnRegisteredFilter;
  TextView mStatus;
  Button configBtn , logoutBtn;
  Context context;
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    context = this;
    setContentView(R.layout.activity_main);
    mStatus = (TextView) findViewById(R.id.status);

    mGCMReceiver = new GCMReceiver();
    mOnRegisteredFilter = new IntentFilter();
    mOnRegisteredFilter.addAction(Constants.ACTION_ON_REGISTERED);

    if (Constants.SENDER_ID == null) {
      mStatus.setText("Missing SENDER_ID");
      return;
    }
    if (Constants.SERVER_URL == null) {
      mStatus.setText("Missing SERVER_URL");
      return;
    }

    GCMRegistrar.checkDevice(this);
    GCMRegistrar.checkManifest(this);
    final String regId = GCMRegistrar.getRegistrationId(this);
    if (!regId.equals("")) {
      sendIdToServer(regId);
    } else {
      GCMRegistrar.register(this, Constants.SENDER_ID);
    }
    configBtn = (Button)findViewById(R.id.ConfigButton);
    configBtn.setOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
            Intent i = new Intent(context,ConfigPreference.class);
            startActivity(i);
        	
        }
    });
    logoutBtn = (Button)findViewById(R.id.LogoutButton);
    logoutBtn.setOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
        	deregisterFromServer(regId);
        }
    });
  }

  private void sendIdToServer(String regId) {
    String status = getString(R.string.gcm_registration, regId);
    mStatus.setText(status);
    (new SendRegistrationIdTask(regId,this)).execute();
  }
  private void deregisterFromServer(String regId){
	    (new DeregistrationTask(regId,this)).execute();
  }
  @Override
  public void onResume() {
    super.onResume();
    registerReceiver(mGCMReceiver, mOnRegisteredFilter);
  }

  @Override
  public void onPause() {
    super.onPause();
    unregisterReceiver(mGCMReceiver);
  }

  private class GCMReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
      String regId = intent.getStringExtra(Constants.FIELD_REGISTRATION_ID);
      sendIdToServer(regId);
    }
  }

  
}

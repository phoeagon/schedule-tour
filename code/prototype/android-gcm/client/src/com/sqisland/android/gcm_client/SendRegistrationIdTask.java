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

import android.os.AsyncTask;
import android.util.Log;
import android.widget.TextView;

final class SendRegistrationIdTask extends
AsyncTask<String, Void, HttpResponse> {
	private String mRegId;
	private SendMsgStatus parent;
	
	public SendRegistrationIdTask(String regId) {
		mRegId = regId;
	}
	public SendRegistrationIdTask(String regId,SendMsgStatus parent) {
		mRegId = regId;
		this.parent = parent;
	}
	public void setParent( SendMsgStatus parent ){
		this.parent = parent;
	}
	@Override
	protected HttpResponse doInBackground(String... regIds) {
		String url = Constants.SERVER_URL + "/gcmRegistry";
		HttpPost httppost = new HttpPost(url);
		
		try {
		  List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
		  nameValuePairs.add(new BasicNameValuePair("deviceID", mRegId));
		  httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
		  HttpClient httpclient = new DefaultHttpClient();
		  return httpclient.execute(httppost);
		} catch (ClientProtocolException e) {
		  Log.e(Constants.TAG, e.getMessage(), e);
		} catch (IOException e) {
		  Log.e(Constants.TAG, e.getMessage(), e);
		}
		
		return null;
	}
	
	@Override
	protected void onPostExecute(HttpResponse response) {
		if (response == null) {
		  Log.e(Constants.TAG, "HttpResponse is null");
		  return;
	}
	
	StatusLine httpStatus = response.getStatusLine();
	if (httpStatus.getStatusCode() != 200) {
	  Log.e(Constants.TAG, "Status: " + httpStatus.getStatusCode());
	  parent.mStatus.setText(httpStatus.getReasonPhrase());
	  return;
	}
	
	String status = parent.getString(R.string.server_registration, mRegId);
	parent.mStatus.setText(status);
	}
}

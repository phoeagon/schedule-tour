package com.sqisland.android.gcm_client;

import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.TextView;

public class MessageActivity extends Activity {
  private TextView mMessageView;

  public void setText(String msg){
	  if ( mMessageView==null)
		  return;
	  String eventTitle = "", time ="", endTime = "", place ="";
	  double lat = 0 , lng = 0;
	    try{
	    JSONObject jsonObj = new JSONObject( msg );
	    eventTitle = jsonObj.getString("title");
	    time = jsonObj.getString("time");
	    endTime = jsonObj.getString("endTime");
	    place = jsonObj.getString("place");
	    lat = jsonObj.getJSONArray("position").getDouble(0);
	    lng = jsonObj.getJSONArray("position").getDouble(1);
	    jsonObj = null;
	    }catch(Exception e){
	    	Log.d("JSONParser","failed at prepareNotification");
	    }
	    String content = eventTitle+"\n"+
	    		( place.length()>0 ? "At "+place : "" )
	    		+"\nAt "+time;
	    mMessageView.setText(  content  	);
	    final String url = Constants.SERVER_URL+"?lat="+lat+"&lng="+lng;
	    mMessageView.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
	    		Log.d("OnClickListener","clicked");
	    		Intent browserIntent = 
	    				new Intent(Intent.ACTION_VIEW, Uri.parse(url));
	    		startActivity(browserIntent);
			}
	    });
  }
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_message);
    mMessageView = (TextView) findViewById(R.id.message);
  }

  @Override
  public void onResume() {
    super.onResume();
    String msg = getIntent().getStringExtra(Constants.FIELD_MESSAGE);
    setText(msg);
  }
}
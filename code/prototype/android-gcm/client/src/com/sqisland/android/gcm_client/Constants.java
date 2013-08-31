package com.sqisland.android.gcm_client;

public abstract class Constants {
  public static final String APP = "com.sqisland.android.gcm_client";
  // Change this to the project id from your API project created at
  // code.google.com, as shown in the url of your project.
  public static final String SENDER_ID = "972473348547";
  // Change this to match your server.
  public static final String SERVER_URL = "http://202.120.40.52:8400";


  public static final String TAG = "sqisland";

  public static final String ACTION_ON_REGISTERED
      = "com.sqisland.android.gcm_client.ON_REGISTERED";

  public static final String FIELD_REGISTRATION_ID = "registration_id";
  public static final String FIELD_MESSAGE = "msg";
}
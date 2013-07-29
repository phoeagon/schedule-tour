package com.sqisland.android.gcm_client;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


import com.google.android.gcm.GCMRegistrar;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;


import android.os.Bundle;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.support.v4.app.*;


public class ConfigPreference extends PreferenceActivity {
	Preference login_button , help_button ;
	Context context;
		public void linkButton(){
			help_button = (Preference)findPreference("help_button");
			help_button.setOnPreferenceClickListener(
				new Preference.OnPreferenceClickListener() {
                @Override
                public boolean onPreferenceClick(Preference arg0) { 
                	String url = Constants.SERVER_URL+"/help/";
                	if (!url.startsWith("http://") && !url.startsWith("https://")) 
                		url = "http://" + url;
                	Intent i = new Intent(Intent.ACTION_VIEW);
                	i.setData(Uri.parse( url ));
                	startActivity(i); 
                	Log.d("test","URI");
                    return true;
                }
            });
			login_button = (Preference)findPreference("login_button");
			login_button.setOnPreferenceClickListener(
				new Preference.OnPreferenceClickListener() {
                @Override
                public boolean onPreferenceClick(Preference arg0) { 
                    //code for what you want it to do   
                    Intent i = new Intent(context,SendMsgStatus.class);
                    startActivity(i);
                    return true;
                }
            });
		}
		@Override
		public void onCreate(Bundle savedInstanceState){
			context = this;
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.loginpreferences);
			linkButton();
		}
		/*@Override
		public boolean onCreateOptionsMenu(Menu menu) {
		    MenuInflater inflater = getMenuInflater();
		    inflater.inflate(R.xml.login_menu, menu);
		    return true;
		}*/
		
}

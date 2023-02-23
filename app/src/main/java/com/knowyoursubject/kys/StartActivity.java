package com.knowyoursubject.kys;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

@SuppressLint({"NewApi", "SetJavaScriptEnabled"})
public class StartActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        // Get the selected item from the Intent
        Intent intent = getIntent();
        String selectedItem = intent.getStringExtra("selectedItem");

        WebView webView = (WebView) findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        ButtonClickJavascriptInterface myJavaScriptInterface = new ButtonClickJavascriptInterface(StartActivity.this);
        webView.addJavascriptInterface(myJavaScriptInterface, "MenuFunction");


        webView.loadUrl("file:///android_asset/index.html?topic="+ selectedItem);
        //String jsString = "javascript:showTopic('" + selectedItem + "');");
        //webView.loadUrl(jsString);


    }

    public class ButtonClickJavascriptInterface {
        StartActivity mContext;
        ButtonClickJavascriptInterface(StartActivity c) {
            mContext = c;
        }

        @JavascriptInterface
        public void onButtonClick() {
            //Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
            mContext.finish();
        }
    }

}
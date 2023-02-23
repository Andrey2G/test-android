package com.knowyoursubject.kys;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebView;

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
        webView.loadUrl("file:///android_asset/index.html?topic="+ selectedItem);
        //String jsString = "javascript:showTopic('" + selectedItem + "');");
        //webView.loadUrl(jsString);
    }
}
package com.knowyoursubject.kys;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        View btnStart = findViewById(R.id.btnStart);
        btnStart.setBackgroundColor(Color.rgb(0, 255, 0));
        btnStart.setOnClickListener(this);

        View btnMore = findViewById(R.id.btnMore);
        btnMore.setBackgroundColor(Color.rgb(0, 255, 0));
        btnMore.setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        if(view.getId() == R.id.btnStart){
            //define a new Intent for the second Activity
            Intent intent = new Intent(this,StartActivity.class);
            //start the second Activity
            this.startActivity(intent);
        }
        if(view.getId() == R.id.btnMore){
            String url = "http://www.knowyoursubject.com";
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            startActivity(i);
        }
    }
}
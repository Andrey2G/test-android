package com.knowyoursubject.kys;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class ChaptersActivity extends AppCompatActivity {

    private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/4411468910";
    private static final String TAG = "ChaptersActivity";
    private ListView listView;
    private int position;
    private InterstitialAd mInterstitialAd;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chapters);

        listView = findViewById(R.id.list_view);

        List<String> items = new ArrayList<>();
        JSONArray ar = null;
        try {
            JSONTokener token = new JSONTokener(convertStreamToString(new InputStreamReader(getAssets().open("data.json"), "UTF-8")));
            ar = new JSONArray(token);
            for(int i=0; i<ar.length(); i++){
                JSONObject json_data = ar.getJSONObject(i);
                items.add(json_data.getString("title"));
            }

            ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                    android.R.layout.simple_list_item_1, items)
            {
                @NonNull
                @Override
                public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
                    View view = super.getView(position, convertView, parent);
                    view.setBackgroundColor(Color.parseColor("#00ff00"));
                    return view;
                }
            };

            if (listView != null) {
                listView.setAdapter(adapter);
            }

            loadAd();
            // Set a click listener on the ListView items
            listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

                    // Get the selected item from the ListView
                    //String selectedItem = (String) parent.getItemAtPosition(position);

                    // Create an Intent to start a new activity and pass the selected item as an extra
                    //Intent intent = new Intent(ChaptersActivity.this, StartActivity.class);
                    //intent.putExtra("selectedItem", Integer.toString(position));
                    //startActivity(intent);
                    showInterstitial(position);
                }
            });

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void showInterstitial(int position) {
        this.position=position;
        // Show the ad if it's ready. Otherwise toast and restart the game.
        if (mInterstitialAd != null) {
            mInterstitialAd.show(this);
        } else {
            //Toast.makeText(this, "Ad did not load", Toast.LENGTH_SHORT).show();
            //startGame();
            startChapter();
        }
    }

    public void startChapter()
    {
        Intent intent = new Intent(ChaptersActivity.this, StartActivity.class);
        intent.putExtra("selectedItem", Integer.toString(position));
        startActivity(intent);
    }

    public void loadAd()
    {
        AdRequest adRequest = new AdRequest.Builder().build();
        InterstitialAd.load(
                this,
                AD_UNIT_ID,
                adRequest,
                new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                        // The mInterstitialAd reference will be null until
                        // an ad is loaded.
                        ChaptersActivity.this.mInterstitialAd = interstitialAd;
                        Log.i(TAG, "onAdLoaded");
                        //Toast.makeText(MyActivity.this, "onAdLoaded()", Toast.LENGTH_SHORT).show();
                        interstitialAd.setFullScreenContentCallback(
                                new FullScreenContentCallback() {
                                    @Override
                                    public void onAdDismissedFullScreenContent() {
                                        // Called when fullscreen content is dismissed.
                                        // Make sure to set your reference to null so you don't
                                        // show it a second time.
                                        ChaptersActivity.this.mInterstitialAd = null;
                                        Log.d("TAG", "The ad was dismissed.");
                                        startChapter();
                                        finish();
                                    }

                                    @Override
                                    public void onAdFailedToShowFullScreenContent(AdError adError) {
                                        // Called when fullscreen content failed to show.
                                        // Make sure to set your reference to null so you don't
                                        // show it a second time.
                                        ChaptersActivity.this.mInterstitialAd = null;
                                        Log.d("TAG", "The ad failed to show.");
                                        startChapter();
                                    }

                                    @Override
                                    public void onAdShowedFullScreenContent() {
                                        // Called when fullscreen content is shown.
                                        Log.d("TAG", "The ad was shown.");
                                    }
                                });
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        // Handle the error
                        Log.i(TAG, loadAdError.getMessage());
                        mInterstitialAd = null;

                        String error = String.format(
                                        "domain: %s, code: %d, message: %s",
                                        loadAdError.getDomain(), loadAdError.getCode(), loadAdError.getMessage());
                        //Toast.makeText( MyActivity.this, "onAdFailedToLoad() with error: " + error, Toast.LENGTH_SHORT).show();
                        startChapter();
                    }
                });
    }
    public static String convertStreamToString(InputStreamReader is) {
        BufferedReader reader = new BufferedReader(is);
        StringBuilder sb = new StringBuilder();
        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

}
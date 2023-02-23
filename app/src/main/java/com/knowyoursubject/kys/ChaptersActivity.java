package com.knowyoursubject.kys;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.os.Bundle;
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

    private ListView listView;

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

            // Set a click listener on the ListView items
            listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    // Get the selected item from the ListView
                    //String selectedItem = (String) parent.getItemAtPosition(position);

                    // Create an Intent to start a new activity and pass the selected item as an extra
                    Intent intent = new Intent(ChaptersActivity.this, StartActivity.class);
                    intent.putExtra("selectedItem", Integer.toString(position));
                    startActivity(intent);
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
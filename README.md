# Go For Self Chatbot

A chatbot for Go For Self (https://goforself.me/)

## Training the bot from our data

To first train our NLU model, run:

`python -m rasa_nlu.train -c goforself_config.json --fixed_model_name current`

Then to train the dialogue model, run:

`python -m rasa_core.train -s data/goforself_stories.md -d goforself_domain.yml -o ai/dialogue`

## Running the HTTP server

To run the HTTP server, run:

`python -m rasa_core.server -d ai/dialogue -u ai/goforself_chatbot/current/ -o out.log`

You can test this is working, by then running:

`curl -XPOST localhost:5005/conversations/default/parse -d '{"query":"hello there"}'`.

You should get a response saying something like:

```
{
   "next_action":"greet",
   "tracker":{
      "slots":{
         "location":null
      },
      "sender_id":"default",
      "latest_message":{
         "entities":[

         ],
         "intent":{
            "confidence":0.2563375738709486,
            "name":"greet"
         },
         "text":"hello there",
         "intent_ranking":[
            {
               "confidence":0.2563375738709486,
               "name":"greet"
            },
            {
               "confidence":0.16403002018159682,
               "name":"farewell"
            },
            {
               "confidence":0.1376213918027149,
               "name":"request_time"
            },
            {
               "confidence":0.09311556965856943,
               "name":"thank_you"
            },
            {
               "confidence":0.08750295708188106,
               "name":"general_checkin"
            },
            {
               "confidence":0.08370778854964189,
               "name":"food_check_in"
            },
            {
               "confidence":0.07846391508797335,
               "name":"general_question"
            },
            {
               "confidence":0.06551253286851422,
               "name":"weather"
            },
            {
               "confidence":0.03370825089815968,
               "name":"age_question"
            }
         ]
      }
   }
}
```

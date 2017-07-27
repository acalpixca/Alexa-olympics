'use strict';

var Alexa = require('alexa-sdk');
//var AmazonDateParser = require('amazon-date-parser'); // Item is AMAZON.DATE and need this package to parse it to JS Date object.
/* See https://medium.com/@niklongstone/alexa-amazon-date-and-js-5c8e819913b2 */

var APP_ID = 'amzn1.ask.skill.8446be94-9149-461e-8332-1a5d53273ea7';// undefined; // TODO replace with your app ID (OPTIONAL).
var recipes = require('./recipes');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'RecipeIntent': function () {
		
		/*
		    var slotValue = this.event.request.intent.slots.date.value;
    var dateRange = new AmazonDateParser(slotValue);
		*/
        //var itemSlot = this.event.request.intent.slots.Item;
		var itemSlot = this.event.request.intent.slots.Item;
        var itemName;
        if (itemSlot && itemSlot.value) {
            // itemName = itemSlot.value.toLowerCase();
			// itemName = new AmazonDateParser(itemSlot.value);
			itemName = itemSlot.value;
			// TODO mira si itemName es del palo 1992 para poder usarlo tal cual.
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), itemName);
        var recipes = this.t("RECIPES");
        var recipe = recipes[itemName];

        if (recipe) {
            this.attributes['speechOutput'] = recipe;
			// this.attributes['speechOutput'] = "Eeeh Macarena";
            this.attributes['repromptSpeech'] = this.t("RECIPE_REPEAT_MESSAGE");
			this.emit(':tellWithCard', cardTitle, cardTitle, recipe, recipe);
        } else {
            var speechOutput = this.t("RECIPE_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("RECIPE_NOT_FOUND_REPROMPT");
            if (itemName) {
                speechOutput += this.t("RECIPE_NOT_FOUND_WITH_ITEM_NAME", itemName);
            } else {
                speechOutput += this.t("RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME");
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var languageStrings = {
    "en": {
        "translation": {
            "RECIPES": recipes.RECIPE_EN_US,
            "SKILL_NAME": "Unofficial Olympic Cities",
            "WELCOME_MESSAGE": "Welcome to %s. Would you like to know where the Olympic Games were held in a particular year?. Ask me, where did the 19 92 olympics take place? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  - Hosting City in %s.",
            "HELP_MESSAGE": "You can ask questions such as, where did the 19 92 olympics take place, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, where did the 19 92 olympics take place, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "RECIPE_REPEAT_MESSAGE": "Try saying repeat.",
            "RECIPE_NOT_FOUND_MESSAGE": "I\'m sorry, I don't know. Maybe that wasn\'t an Olympic year ",
            "RECIPE_NOT_FOUND_WITH_ITEM_NAME": ", %s . ",
            "RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME": ". ",
            "RECIPE_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            "RECIPES" : recipes.RECIPE_EN_US,
            "SKILL_NAME" : "Unofficial Olympic Cities"
        }
    },
    "en-GB": {
        "translation": {
            "RECIPES": recipes.RECIPE_EN_GB,
            "SKILL_NAME": "Unofficial Olympic Cities"
        }
    },
    "de": {
        "translation": {
            "RECIPES" : recipes.RECIPE_DE_DE,
            "SKILL_NAME" : "Unofficial Olympic Cities",
            "WELCOME_MESSAGE": "Willkommen bei %s. Du kannst beispielsweise die Frage stellen: Welche Rezepte gibt es für eine Truhe? ... Nun, womit kann ich dir helfen?",
            "WELCOME_REPROMPT": "Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.",
            "DISPLAY_CARD_TITLE": "%s - Rezept für %s.",
            "HELP_MESSAGE": "Du kannst beispielsweise Fragen stellen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?",
            "HELP_REPROMPT": "Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?",
            "STOP_MESSAGE": "Auf Wiedersehen!",
            "RECIPE_REPEAT_MESSAGE": "Sage einfach „Wiederholen“.",
            "RECIPE_NOT_FOUND_MESSAGE": "Tut mir leid, ich kenne derzeit ",
            "RECIPE_NOT_FOUND_WITH_ITEM_NAME": "das Rezept für %s nicht. ",
            "RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME": "dieses Rezept nicht. ",
            "RECIPE_NOT_FOUND_REPROMPT": "Womit kann ich dir sonst helfen?"
        }
    }
};
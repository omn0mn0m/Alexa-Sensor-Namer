'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).
var measurements = require('./measurements');

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
    'MeasurementIntent': function () {
        var measurementSlot = this.event.request.intent.slots.Measurement;
        var measurementName;
        if (measurementSlot && measurementSlot.value) {
            measurementName = measurementSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), measurementName);
        var measurements = this.t("MEASUREMENTS");
        var measurement = measurements[measurementName];

        if (measurement) {
            this.attributes['speechOutput'] = measurement;
            this.attributes['repromptSpeech'] = this.t("MEASUREMENT_REPEAT_MESSAGE");
            this.emit(':tellWithCard', measurement, this.attributes['repromptSpeech'], cardTitle, measurement);
        } else {
            var speechOutput = this.t("MEASUREMENT_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("MEASUREMENT_NOT_FOUND_REPROMPT");
            if (measurementName) {
                speechOutput += this.t("MEASUREMENT_NOT_FOUND_WITH_ITEM_NAME", measurementName);
            } else {
                speechOutput += this.t("MEASUREMENT_NOT_FOUND_WITHOUT_ITEM_NAME");
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
            "MEASUREMENTS": measurements.MEASUREMENT_EN_US,
            "SKILL_NAME": "Sensor Helper",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s the measurement for a chest? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  - Measurement for %s.",
            "HELP_MESSAGE": "You can ask questions such as, what\'s the measurement, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, what\'s the measurement, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "MEASUREMENT_REPEAT_MESSAGE": "Try saying repeat.",
            "MEASUREMENT_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "MEASUREMENT_NOT_FOUND_WITH_ITEM_NAME": "the measurement for %s. ",
            "MEASUREMENT_NOT_FOUND_WITHOUT_ITEM_NAME": "that measurement. ",
            "MEASUREMENT_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            "MEASUREMENTS" : measurements.MEASUREMENT_EN_US,
            "SKILL_NAME" : "Sensor Namer (US)"
        }
    },
    "en-GB": {
        "translation": {
            "MEASUREMENTS": measurements.MEASUREMENT_EN_US,
            "SKILL_NAME": "Sensor Namer (GB)"
        }
    }
};
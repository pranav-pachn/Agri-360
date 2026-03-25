const translations = {
  hi: {
    "Expected yield is 4.5 tons/hectare. Loan eligibility: Eligible.":
      "अपेक्षित उपज 4.5 टन/हेक्टेयर है। ऋण पात्रता: पात्र।",
    "Disease detected: Leaf Blight. Spray fungicide within 48 hours and avoid overwatering.":
      "रोग पाया गया: लीफ ब्लाइट। 48 घंटों के भीतर फफूंदनाशक का छिड़काव करें और अधिक सिंचाई से बचें।",
    "Disease detected: Leaf Blight. Spray fungicide within 48 hours and avoid overwatering. The crop is currently at high risk and needs immediate attention.":
      "रोग पाया गया: लीफ ब्लाइट। 48 घंटों के भीतर फफूंदनाशक का छिड़काव करें और अधिक सिंचाई से बचें। फसल अभी उच्च जोखिम में है और तुरंत ध्यान देने की आवश्यकता है।",
    "High risk detected ⚠️. Immediate action required within 24–48 hours.":
      "उच्च जोखिम ⚠️। 24–48 घंटे में तुरंत कार्रवाई करें।",
    "Low risk. Crop condition is stable.":
      "कम जोखिम। फसल की स्थिति स्थिर है।",
    "You are eligible for a loan.": "आप ऋण के लिए पात्र हैं।",
    "Improve farm stability to increase loan eligibility.":
      "ऋण पात्रता बढ़ाने के लिए खेत की स्थिरता सुधारें।",
    "Yield and risk directly affect your income.":
      "उपज और जोखिम सीधे आपकी आय को प्रभावित करते हैं।",
    "High risk detected. Immediate action is required.":
      "उच्च जोखिम पाया गया है। तुरंत कार्रवाई आवश्यक है।",
    "Moderate risk. Monitor crop regularly and take preventive measures.":
      "मध्यम जोखिम है। फसल की नियमित निगरानी करें और निवारक उपाय अपनाएँ।",
    "You can ask about disease, yield, or loan eligibility.":
      "आप रोग, उपज या ऋण पात्रता के बारे में पूछ सकते हैं।",
    "Your crop is at high risk. Apply treatment immediately and monitor closely.":
      "आपकी फसल उच्च जोखिम में है। तुरंत उपचार करें और नज़दीकी निगरानी रखें।",
    "Please upload crop image or ask about disease, yield, risk, or loan eligibility.":
      "कृपया फसल की छवि अपलोड करें या रोग, उपज, जोखिम या ऋण पात्रता के बारे में पूछें।"
  },
  te: {
    "Expected yield is 4.5 tons/hectare. Loan eligibility: Eligible.":
      "అంచనా దిగుబడి 4.5 టన్నులు/హెక్టారు. రుణ అర్హత: అర్హులు.",
    "Disease detected: Leaf Blight. Spray fungicide within 48 hours and avoid overwatering.":
      "వ్యాధి గుర్తించబడింది: లీఫ్ బ్లైట్. 48 గంటల్లో ఫంగిసైడ్ పిచికారీ చేసి అధిక నీరు పోయడం నివారించండి.",
    "Disease detected: Leaf Blight. Spray fungicide within 48 hours and avoid overwatering. The crop is currently at high risk and needs immediate attention.":
      "వ్యాధి గుర్తించబడింది: లీఫ్ బ్లైట్. 48 గంటల్లో ఫంగిసైడ్ పిచికారీ చేసి అధిక నీరు పోయడం నివారించండి. పంట ప్రస్తుతం అధిక ప్రమాదంలో ఉంది మరియు వెంటనే శ్రద్ధ అవసరం.",
    "High risk detected ⚠️. Immediate action required within 24–48 hours.":
      "అధిక ప్రమాదం ⚠️. 24–48 గంటల్లో చర్య తీసుకోండి.",
    "Low risk. Crop condition is stable.":
      "తక్కువ ప్రమాదం. పంట స్థిరంగా ఉంది।",
    "You are eligible for a loan.": "మీరు రుణానికి అర్హులు.",
    "Improve farm stability to increase loan eligibility.":
      "రుణ అర్హత పెంచడానికి వ్యవసాయాన్ని మెరుగుపరచండి.",
    "Yield and risk directly affect your income.":
      "దిగుబడి మరియు ప్రమాదం మీ ఆదాయాన్ని నేరుగా ప్రభావితం చేస్తాయి.",
    "High risk detected. Immediate action is required.":
      "అధిక ప్రమాదం గుర్తించబడింది. వెంటనే చర్య అవసరం.",
    "Moderate risk. Monitor crop regularly and take preventive measures.":
      "మధ్యస్థ ప్రమాదం ఉంది. పంటను క్రమం తప్పకుండా పరిశీలించి నిరోధక చర్యలు తీసుకోండి.",
    "You can ask about disease, yield, or loan eligibility.":
      "మీరు వ్యాధి, దిగుబడి లేదా రుణ అర్హత గురించి అడగవచ్చు.",
    "Your crop is at high risk. Apply treatment immediately and monitor closely.":
      "మీ పంట అధిక ప్రమాదంలో ఉంది. వెంటనే చికిత్స చేసి దగ్గరగా గమనించండి.",
    "Please upload crop image or ask about disease, yield, risk, or loan eligibility.":
      "దయచేసి పంట చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా వ్యాధి, దిగుబడి, ప్రమాదం లేదా రుణ అర్హత గురించి అడగండి."
  }
};

const translate = (text, lang) => {
  return translations[lang]?.[text] || text;
};

module.exports = { translate };

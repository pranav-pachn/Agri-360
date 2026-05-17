const exactTranslations = {
  hi: {
    'Please ask about risk, yield, trust score, or loan eligibility.':
      'कृपया जोखिम, उपज, ट्रस्ट स्कोर या ऋण पात्रता के बारे में पूछें।',
    'This currently supports loan eligibility.':
      'यह वर्तमान में ऋण पात्रता का समर्थन करता है।',
    'Improving yield stability and lowering risk will strengthen eligibility.':
      'उपज स्थिरता बढ़ाने और जोखिम कम करने से पात्रता मजबूत होगी।',
    'High Risk': 'उच्च जोखिम',
    'Medium Risk': 'मध्यम जोखिम',
    'Low Risk': 'कम जोखिम',
  },
  te: {
    'Please ask about risk, yield, trust score, or loan eligibility.':
      'దయచేసి రిస్క్, దిగుబడి, ట్రస్ట్ స్కోర్ లేదా రుణ అర్హత గురించి అడగండి.',
    'This currently supports loan eligibility.':
      'ఇది ప్రస్తుతం రుణ అర్హతకు మద్దతు ఇస్తోంది.',
    'Improving yield stability and lowering risk will strengthen eligibility.':
      'దిగుబడి స్థిరత్వాన్ని మెరుగుపరచడం మరియు రిస్క్ తగ్గించడం అర్హతను బలపరుస్తాయి.',
    'High Risk': 'అధిక ప్రమాదం',
    'Medium Risk': 'మధ్యస్థ ప్రమాదం',
    'Low Risk': 'తక్కువ ప్రమాదం',
  },
};

const explanationTranslations = {
  hi: {
    'Overall risk is Low Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.':
      'कुल जोखिम कम है। यह स्कोर फसल स्वास्थ्य, अनुमानित उपज दबाव, पुनर्भुगतान क्षमता और मौजूदा खेत अस्थिरता को दर्शाता है।',
    'Overall risk is Medium Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.':
      'कुल जोखिम मध्यम है। यह स्कोर फसल स्वास्थ्य, अनुमानित उपज दबाव, पुनर्भुगतान क्षमता और मौजूदा खेत अस्थिरता को दर्शाता है।',
    'Overall risk is High Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.':
      'कुल जोखिम उच्च है। यह स्कोर फसल स्वास्थ्य, अनुमानित उपज दबाव, पुनर्भुगतान क्षमता और मौजूदा खेत अस्थिरता को दर्शाता है।',
  },
  te: {
    'Overall risk is Low Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.':
      'మొత్తం రిస్క్ తక్కువగా ఉంది. ఈ స్కోర్ పంట ఆరోగ్యం, అంచనా దిగుబడి ఒత్తిడి, చెల్లింపు సామర్థ్యం మరియు ప్రస్తుత పొల అస్థిరతను ప్రతిబింబిస్తుంది.',
    'Overall risk is Medium Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.':
      'మొత్తం రిస్క్ మధ్యస్థంగా ఉంది. ఈ స్కోర్ పంట ఆరోగ్యం, అంచనా దిగుబడి ఒత్తిడి, చెల్లింపు సామర్థ్యం మరియు ప్రస్తుత పొల అస్థిరతను ప్రతిబింబిస్తుంది.',
    'Overall risk is High Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.':
      'మొత్తం రిస్క్ అధికంగా ఉంది. ఈ స్కోర్ పంట ఆరోగ్యం, అంచనా దిగుబడి ఒత్తిడి, చెల్లింపు సామర్థ్యం మరియు ప్రస్తుత పొల అస్థిరతను ప్రతిబింబిస్తుంది.',
  },
};

const riskLabel = (lang, label) => exactTranslations[lang]?.[label] || label;

const translateExplanation = (text, lang) => {
  if (explanationTranslations[lang]?.[text]) {
    return explanationTranslations[lang][text];
  }

  const dynamicMatch = text.match(
    /^Overall risk is (.+)\. The current risk score is ([\d.]+), projected yield is ([\d.]+) tons\/hectare, and trust score is (\d+)\.$/
  );

  if (!dynamicMatch) {
    return text;
  }

  const [, level, riskScore, yieldValue, trustScore] = dynamicMatch;

  if (lang === 'hi') {
    return `कुल जोखिम ${riskLabel('hi', level)} है। वर्तमान जोखिम स्कोर ${riskScore} है, अनुमानित उपज ${yieldValue} टन/हेक्टेयर है, और ट्रस्ट स्कोर ${trustScore} है।`;
  }

  if (lang === 'te') {
    return `మొత్తం రిస్క్ ${riskLabel('te', level)}. ప్రస్తుత రిస్క్ స్కోర్ ${riskScore}, అంచనా దిగుబడి ${yieldValue} టన్నులు/హెక్టారు, మరియు ట్రస్ట్ స్కోర్ ${trustScore}.`;
  }

  return text;
};

const patternTranslators = {
  hi: [
    {
      pattern: /^Your risk is ([\d.]+) \((.+)\)\. (.+)$/,
      translate: ([, score, level, reason]) =>
        `आपका जोखिम ${score} (${riskLabel('hi', level)}) है। ${translateExplanation(reason, 'hi')}`,
    },
    {
      pattern: /^You are eligible for a loan with moderate confidence\. Your trust score is (\d+), and current risk is (.+)\.$/,
      translate: ([, score, level]) =>
        `आप मध्यम विश्वास के साथ ऋण के लिए पात्र हैं। आपका ट्रस्ट स्कोर ${score} है, और वर्तमान जोखिम ${riskLabel('hi', level)} है।`,
    },
    {
      pattern: /^Your current trust score is (\d+), which is below the current loan approval range\.$/,
      translate: ([, score]) =>
        `आपका वर्तमान ट्रस्ट स्कोर ${score} है, जो मौजूदा ऋण स्वीकृति सीमा से नीचे है।`,
    },
    {
      pattern: /^Your trust score is (\d+)\. (.+)$/,
      translate: ([, score, remainder]) =>
        `आपका ट्रस्ट स्कोर ${score} है। ${exactTranslations.hi[remainder] || remainder}`,
    },
    {
      pattern: /^Your projected yield is ([\d.]+) tons\/hectare\.$/,
      translate: ([, value]) => `आपकी अनुमानित उपज ${value} टन/हेक्टेयर है।`,
    },
    {
      pattern: /^Here is why: (.+)$/,
      translate: ([, reason]) => `कारण यह है: ${translateExplanation(reason, 'hi')}`,
    },
    {
      pattern: /^The latest crop diagnosis indicates (.+) for (.+)\.$/,
      translate: ([, disease, crop]) => `नवीनतम फसल निदान ${crop} के लिए ${disease} दर्शाता है।`,
    },
  ],
  te: [
    {
      pattern: /^Your risk is ([\d.]+) \((.+)\)\. (.+)$/,
      translate: ([, score, level, reason]) =>
        `మీ రిస్క్ ${score} (${riskLabel('te', level)}). ${translateExplanation(reason, 'te')}`,
    },
    {
      pattern: /^You are eligible for a loan with moderate confidence\. Your trust score is (\d+), and current risk is (.+)\.$/,
      translate: ([, score, level]) =>
        `మీరు మోస్తరు విశ్వాసంతో రుణానికి అర్హులు. మీ ట్రస్ట్ స్కోర్ ${score}, ప్రస్తుత రిస్క్ ${riskLabel('te', level)}.`,
    },
    {
      pattern: /^Your current trust score is (\d+), which is below the current loan approval range\.$/,
      translate: ([, score]) =>
        `మీ ప్రస్తుత ట్రస్ట్ స్కోర్ ${score}, ఇది ప్రస్తుత రుణ ఆమోద పరిధికి దిగువన ఉంది.`,
    },
    {
      pattern: /^Your trust score is (\d+)\. (.+)$/,
      translate: ([, score, remainder]) =>
        `మీ ట్రస్ట్ స్కోర్ ${score}. ${exactTranslations.te[remainder] || remainder}`,
    },
    {
      pattern: /^Your projected yield is ([\d.]+) tons\/hectare\.$/,
      translate: ([, value]) => `మీ అంచనా దిగుబడి ${value} టన్నులు/హెక్టారు.`,
    },
    {
      pattern: /^Here is why: (.+)$/,
      translate: ([, reason]) => `కారణం ఇది: ${translateExplanation(reason, 'te')}`,
    },
    {
      pattern: /^The latest crop diagnosis indicates (.+) for (.+)\.$/,
      translate: ([, disease, crop]) => `తాజా పంట నిర్ధారణ ${crop} కోసం ${disease}ని సూచిస్తోంది.`,
    },
  ],
};

const translate = (text, lang) => {
  if (!lang || lang === 'en') return text;

  if (exactTranslations[lang]?.[text]) {
    return exactTranslations[lang][text];
  }

  const translators = patternTranslators[lang] || [];
  for (const translator of translators) {
    const match = text.match(translator.pattern);
    if (match) {
      return translator.translate(match);
    }
  }

  return text;
};

module.exports = { translate };

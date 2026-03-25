/**
 * Debug Chatbot Engine
 */

const { processChat } = require('./ai/chatbot/chatEngine');

console.log("=== DEBUGGING CHATBOT ENGINE ===\n");

const testContext = {
    disease: "Early Blight",
    riskLevel: "High Risk",
    projectedYield: 12,
    trustScore: 65
};

console.log("Test Context:");
console.log(JSON.stringify(testContext, null, 2));
console.log("");

// Test basic functionality
console.log("Testing basic processChat function...");

try {
    const result = processChat({ message: "What disease is this?", context: testContext });
    console.log("Result:", JSON.stringify(result, null, 2));
} catch (error) {
    console.error("Error in processChat:", error);
    console.error("Stack:", error.stack);
}

// Test response engine directly
console.log("\nTesting response engine directly...");
try {
    const { getResponse } = require('./ai/chatbot/responseEngine');
    const response = getResponse("What disease is this?", testContext);
    console.log("Response:", response);
} catch (error) {
    console.error("Error in getResponse:", error);
    console.error("Stack:", error.stack);
}

// Test translator
console.log("\nTesting translator...");
try {
    const { translate } = require('./ai/chatbot/translator');
    const translation = translate("Hello world", "hi");
    console.log("Translation:", translation);
} catch (error) {
    console.error("Error in translate:", error);
    console.error("Stack:", error.stack);
}

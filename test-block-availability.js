// Quick test script to verify digit_comparison block is loaded
// Run this in browser console to check if the block is available

console.log('🔍 Testing digit_comparison block availability...');

// Check if the block is registered
if (window.Blockly && window.Blockly.Blocks && window.Blockly.Blocks.digit_comparison) {
    console.log('✅ digit_comparison block is registered');
    
    // Check if the JavaScript generator is available
    if (window.Blockly.JavaScript && window.Blockly.JavaScript.digit_comparison) {
        console.log('✅ digit_comparison JavaScript generator is available');
    } else {
        console.log('❌ digit_comparison JavaScript generator is missing');
    }
    
    // Try to get the block definition
    try {
        const blockDef = window.Blockly.Blocks.digit_comparison.definition();
        console.log('✅ Block definition loaded:', blockDef.message0);
    } catch (error) {
        console.log('❌ Error getting block definition:', error);
    }
    
} else {
    console.log('❌ digit_comparison block is NOT registered');
    console.log('Available blocks:', Object.keys(window.Blockly?.Blocks || {}));
}

// Check if Bot API method is available
if (typeof Bot !== 'undefined' && Bot.checkDigitComparison) {
    console.log('✅ Bot.checkDigitComparison method is available');
    
    // Test the method
    Bot.checkDigitComparison(3, 'equal', 5).then(result => {
        console.log('✅ Method test successful, result:', result);
    }).catch(error => {
        console.log('❌ Method test failed:', error);
    });
} else {
    console.log('❌ Bot.checkDigitComparison method is NOT available');
    if (typeof Bot !== 'undefined') {
        console.log('Available Bot methods:', Object.keys(Bot));
    } else {
        console.log('Bot instance is not available');
    }
}

// Check if block appears in toolbox
const toolboxItems = document.querySelectorAll('[data-id="digit_comparison"]');
if (toolboxItems.length > 0) {
    console.log('✅ Block found in toolbox');
} else {
    console.log('❌ Block NOT found in toolbox');
}

console.log('Test complete. Check the messages above for any issues.');

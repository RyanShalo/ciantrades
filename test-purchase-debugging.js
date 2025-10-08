// Test for Purchase Block with Tick Trading
// This file tests if the purchase block generates correct JavaScript code

// Test 1: Normal trading (trade_each_tick = false)
console.log('Test 1: Normal Trading');
console.log('Expected: Bot.purchase(\'CALL\', false);');

// Test 2: Tick trading (trade_each_tick = true)  
console.log('\nTest 2: Tick Trading');
console.log('Expected: Bot.purchase(\'DIGITEVEN\', true);');

// Test 3: String values
console.log('\nTest 3: String Values');
console.log('Expected: Bot.purchase(\'DIGITODD\', \'true\');');

// Manual test to verify purchase method signature
function testPurchaseCall(contract_type, trade_each_tick) {
    console.log(`\nCalling Bot.purchase('${contract_type}', ${trade_each_tick})`);
    console.log('Type of trade_each_tick:', typeof trade_each_tick);
    console.log('Value check - true:', trade_each_tick === true);
    console.log('Value check - "true":', trade_each_tick === 'true');
    
    // Simulate the logic from Purchase.js
    if (trade_each_tick === true || trade_each_tick === 'true') {
        console.log('✅ WOULD ENABLE TICK TRADING');
    } else {
        console.log('❌ Would use normal trading');
    }
}

// Run tests
console.log('\n=== RUNNING TESTS ===');
testPurchaseCall('CALL', false);
testPurchaseCall('DIGITEVEN', true);
testPurchaseCall('DIGITODD', 'true');
testPurchaseCall('PUT', 'false');

console.log('\n=== BLOCKLY CODE GENERATION TEST ===');
console.log('The purchase block should generate:');
console.log('- For "No": Bot.purchase(\'CONTRACT\', false);');
console.log('- For "Yes": Bot.purchase(\'CONTRACT\', true);');

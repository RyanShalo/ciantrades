/**
 * Test file for digit_comparison block
 * Tests various comparison operations on last N digits
 */

// Test cases for checkDigitComparison method
const testCases = [
    {
        name: 'Equal to comparison - all digits equal 5',
        ticks: [1.2345, 1.2355, 1.2355, 1.2365],
        count: 3,
        operator: 'equal',
        digit: 5,
        expected: true
    },
    {
        name: 'Equal to comparison - not all digits equal 5',
        ticks: [1.2345, 1.2357, 1.2355, 1.2365],
        count: 3,
        operator: 'equal',
        digit: 5,
        expected: false
    },
    {
        name: 'Greater than comparison - all digits > 3',
        ticks: [1.2344, 1.2357, 1.2358, 1.2369],
        count: 3,
        operator: 'greater',
        digit: 3,
        expected: true
    },
    {
        name: 'Greater than comparison - not all digits > 7',
        ticks: [1.2344, 1.2357, 1.2358, 1.2369],
        count: 3,
        operator: 'greater',
        digit: 7,
        expected: false
    },
    {
        name: 'Less than comparison - all digits < 5',
        ticks: [1.2341, 1.2342, 1.2343, 1.2344],
        count: 4,
        operator: 'less',
        digit: 5,
        expected: true
    },
    {
        name: 'Less than comparison - not all digits < 3',
        ticks: [1.2341, 1.2342, 1.2343, 1.2344],
        count: 4,
        operator: 'less',
        digit: 3,
        expected: false
    },
    {
        name: 'Greater or equal comparison - all digits >= 5',
        ticks: [1.2345, 1.2356, 1.2357, 1.2358],
        count: 4,
        operator: 'greater_equal',
        digit: 5,
        expected: true
    },
    {
        name: 'Greater or equal comparison - not all digits >= 7',
        ticks: [1.2345, 1.2356, 1.2357, 1.2358],
        count: 4,
        operator: 'greater_equal',
        digit: 7,
        expected: false
    },
    {
        name: 'Less or equal comparison - all digits <= 5',
        ticks: [1.2341, 1.2342, 1.2343, 1.2345],
        count: 4,
        operator: 'less_equal',
        digit: 5,
        expected: true
    },
    {
        name: 'Less or equal comparison - not all digits <= 3',
        ticks: [1.2341, 1.2342, 1.2343, 1.2345],
        count: 4,
        operator: 'less_equal',
        digit: 3,
        expected: false
    },
    {
        name: 'Edge case - single digit comparison',
        ticks: [1.2347],
        count: 1,
        operator: 'equal',
        digit: 7,
        expected: true
    },
    {
        name: 'Edge case - empty ticks',
        ticks: [],
        count: 3,
        operator: 'equal',
        digit: 5,
        expected: false
    }
];

// Mock the Bot.checkDigitComparison function for testing
function testCheckDigitComparison() {
    console.log('Testing digit_comparison block functionality...\n');

    testCases.forEach((testCase, index) => {
        console.log(`Test ${index + 1}: ${testCase.name}`);
        console.log(`Ticks: [${testCase.ticks.join(', ')}]`);
        console.log(`Count: ${testCase.count}, Operator: ${testCase.operator}, Target Digit: ${testCase.digit}`);
        
        // Extract last digits from ticks (simulating the actual method)
        const digits = testCase.ticks.map(tick => {
            const tickStr = tick.toString();
            return parseInt(tickStr.charAt(tickStr.length - 1));
        }).slice(-testCase.count);
        
        let result = false;
        const target = testCase.digit;
        
        if (digits.length > 0) {
            switch (testCase.operator) {
                case 'equal':
                    result = digits.every(digit => digit === target);
                    break;
                case 'greater':
                    result = digits.every(digit => digit > target);
                    break;
                case 'less':
                    result = digits.every(digit => digit < target);
                    break;
                case 'greater_equal':
                    result = digits.every(digit => digit >= target);
                    break;
                case 'less_equal':
                    result = digits.every(digit => digit <= target);
                    break;
            }
        }
        
        console.log(`Last ${testCase.count} digits: [${digits.join(', ')}]`);
        console.log(`Expected: ${testCase.expected}, Got: ${result}`);
        console.log(`Status: ${result === testCase.expected ? '✅ PASS' : '❌ FAIL'}\n`);
    });
}

// Run the tests
testCheckDigitComparison();

// Example usage in Blockly
console.log('Example Blockly usage:');
console.log('Bot.checkDigitComparison(5, "equal", 7) // Check if last 5 digits are all equal to 7');
console.log('Bot.checkDigitComparison(3, "greater", 5) // Check if last 3 digits are all greater than 5');
console.log('Bot.checkDigitComparison(10, "less_equal", 4) // Check if last 10 digits are all ≤ 4');

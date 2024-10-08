import { DecisionTree } from './decisionTree';

// Simple condition without a true action
const simpleConditionJson = JSON.stringify({
  type: 'Condition',
  condition: 'true',
  trueAction: { type: 'SendSMS', phoneNumber: '+1234567890' },
});

console.log('--- Simple condition without a true action ---');
const simpleConditionTree = DecisionTree.deserialize(simpleConditionJson);
simpleConditionTree.execute();

// Christmas condition
const christmasConditionJson = JSON.stringify({
  type: 'Condition',
  condition: "new Date().toDateString() === 'Wed Jan 01 2025'",
  trueAction: { type: 'SendSMS', phoneNumber: '+1234567890' },
});

console.log('--- Christmas condition ---');
const christmasTree = DecisionTree.deserialize(christmasConditionJson);
christmasTree.execute();

// Loop with nested condition
const loopWithConditionJson = JSON.stringify({
  type: 'Loop',
  times: 5,
  subtree: {
    type: 'Condition',
    condition: 'Math.random() > 0.5',
    trueAction: { type: 'SendSMS', phoneNumber: '+0987654321' },
    falseAction: {
      type: 'SendEmail',
      sender: 'test@example.com',
      receiver: 'receiver@example.com',
    },
  },
});

console.log('--- Loop with nested condition ---');
const loopWithConditionTree = DecisionTree.deserialize(loopWithConditionJson);
loopWithConditionTree.execute();

// Sequential actions
const sequenceActionsJson = JSON.stringify({
  type: 'Condition',
  condition: 'true',
  trueAction: {
    type: 'Loop',
    times: 3,
    subtree: {
      type: 'Condition',
      condition: 'true',
      trueAction: {
        type: 'SendEmail',
        sender: 'sender@example.com',
        receiver: 'receiver@example.com',
      },
    },
  },
  falseAction: {
    type: 'SendSMS',
    phoneNumber: '+1111111111',
  },
});

console.log('--- Sequential actions ---');
const sequenceActionsTree = DecisionTree.deserialize(sequenceActionsJson);
sequenceActionsTree.execute();

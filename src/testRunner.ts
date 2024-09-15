import { DecisionTree } from './decisionTree';

// Simple condition without a falseAction
const simpleConditionJson = JSON.stringify({
  type: 'Condition',
  condition: 'true',
  trueAction: { type: 'SendSMS', phoneNumber: '+1234567890' },
});

console.log('--- Simple condition without a falseAction ---');
const simpleConditionTree = DecisionTree.deserialize(simpleConditionJson);
simpleConditionTree.execute();

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

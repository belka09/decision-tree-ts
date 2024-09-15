interface Action {
  execute(): void;
}

class SendSMS implements Action {
  constructor(private phoneNumber: string) {}
  execute(): void {
    console.log(`Sending SMS to: ${this.phoneNumber}`);
  }
}

class SendEmail implements Action {
  constructor(private sender: string, private receiver: string) {}
  execute(): void {
    console.log(`Sending email from: ${this.sender} to: ${this.receiver}`);
  }
}

class Condition implements Action {
  constructor(
    private condition: string,
    private trueAction: Action,
    private falseAction?: Action
  ) {}

  execute(): void {
    if (eval(this.condition)) {
      this.trueAction.execute();
    } else if (this.falseAction) {
      this.falseAction.execute();
    }
  }
}

class Loop implements Action {
  constructor(private times: number, private subtree: Action) {}

  execute(): void {
    for (let i = 0; i < this.times; i++) {
      this.subtree.execute();
    }
  }
}

export class DecisionTree {
  constructor(private root: Action) {}

  execute(): void {
    this.root.execute();
  }

  static serialize(tree: DecisionTree): string {
    return JSON.stringify(tree, (key, value) => {
      if (typeof value === 'function') return undefined;
      return value;
    });
  }

  static deserialize(json: string): DecisionTree {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== 'object' || !obj.type) {
      throw new Error('Invalid JSON: Root object must have a type property');
    }
    const root = DecisionTree.createAction(obj);
    return new DecisionTree(root);
  }

  private static createAction(obj: any): Action {
    if (!obj || !obj.type) {
      throw new Error('Invalid JSON: Action object must have a type property');
    }

    switch (obj.type) {
      case 'SendSMS':
        if (!obj.phoneNumber) {
          throw new Error('SendSMS action requires a phoneNumber property');
        }
        return new SendSMS(obj.phoneNumber);
      case 'SendEmail':
        if (!obj.sender || !obj.receiver) {
          throw new Error(
            'SendEmail action requires sender and receiver properties'
          );
        }
        return new SendEmail(obj.sender, obj.receiver);
      case 'Condition':
        if (!obj.condition || !obj.trueAction) {
          throw new Error(
            'Condition action requires condition and trueAction properties'
          );
        }
        return new Condition(
          obj.condition,
          DecisionTree.createAction(obj.trueAction),
          obj.falseAction
            ? DecisionTree.createAction(obj.falseAction)
            : undefined
        );
      case 'Loop':
        if (typeof obj.times !== 'number' || !obj.subtree) {
          throw new Error(
            'Loop action requires times (number) and subtree properties'
          );
        }
        return new Loop(obj.times, DecisionTree.createAction(obj.subtree));
      default:
        throw new Error(`Unknown action type: ${obj.type}`);
    }
  }
}

export enum pollAnswerEnum {
  ACCEPT,
  REJECT
}

export interface IPoll {
  id: number;
  creatorId: number;
  createDate: Date;
  option1: IAnswer;
  option2: IAnswer;
}

interface IAnswer {
  id: pollAnswerEnum;
  text: string;
  answeredUsers: number[];
}

export class ModelPoll implements IPoll {
  readonly id: number;
  readonly creatorId: number;
  readonly createDate: Date;
  readonly option1: IAnswer;
  readonly option2: IAnswer;

  constructor({
    id = NaN,
    creatorId = NaN,
    createDate = new Date(),
    option1 = null,
    option2 = null
  }: Partial<IPoll> = {}) {
    this.id = id;
    this.creatorId = creatorId;
    this.createDate = createDate;
    this.option1 = option1;
    this.option2 = option2;
  }

  serialize(): IPoll {
    return {
      id: this.id,
      creatorId: this.creatorId,
      createDate: this.createDate,
      option1: this.option1,
      option2: this.option2
    };
  }

  clone(): ModelPoll {
    return new ModelPoll(this.serialize());
  }
}

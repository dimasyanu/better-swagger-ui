export class ApiSource {
  constructor(
    public active: boolean = false,
    public currentId: string = '',
    public sources: ApiSourceItem[] = []
  ) {}
}

export class ApiSourceItem {
  constructor(public id: string = '', public name: string = '', public jsonUrl: string = '') {}
}

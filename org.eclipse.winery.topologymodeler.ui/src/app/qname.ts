/**
 * Retrieves the local name and the namespace from the qname
 */
export class QName {
  private _localName: string;
  private _nameSpace: string;

  constructor(private _qName: string) {
  }

  /**
   * Getter for localName
   */
  get localName(): string {
    this._localName = this._qName.split('}')[1];
    return this._localName;
  }

  /**
   * Setter for localName
   */
  set localName(value: string) {
    this._localName = value;
  }

  /**
   * Getter for namespace
   */
  get nameSpace(): string {
    this._nameSpace = this._qName.split('}')[0];
    return this._nameSpace + '}';
  }

  /**
   * Setter for namespace
   */
  set nameSpace(value: string) {
    this._nameSpace = value;
  }
}

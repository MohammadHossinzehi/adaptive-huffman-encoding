class HuffmanNode {
  constructor(symbol = null, freq = 0, left = null, right = null) {
    this.symbol = symbol;
    this.freq = freq;
    this.left = left;
    this.right = right;
    this.parent = null;
    this.code = '';
  }
}

class AdaptiveHuffman {
  constructor() {
    this.root = null;
    this.nytNode = null;
    this.symbolTable = new Map();
    this.nextNodeNum = 0;
  }

  encode(text) {
    this.reset();
    let binary = '';
    let bitCount = 0;

    for (let char of text) {
      if (!this.symbolTable.has(char)) {
        binary += this._encodeNewSymbol(char);
        bitCount += 8 + this._codeLength(this.nytNode);
      } else {
        binary += this.symbolTable.get(char).code;
        bitCount += this.symbolTable.get(char).code.length;
      }
      this._updateTree(char);
    }

    return {
      binary: binary,
      ratio: binary.length / (text.length * 8),
      originalBits: text.length * 8,
      compressedBits: binary.length,
      savings: text.length * 8 - binary.length
    };
  }

  decode(binary) {
    this.reset();
    let text = '';
    let index = 0;

    while (index < binary.length) {
      const result = this._decodeSymbol(binary, index);
      if (result.symbol === null) break;
      
      text += result.symbol;
      index = result.nextIndex;
      if (result.symbol) this._updateTree(result.symbol);
    }

    return text;
  }

  _encodeNewSymbol(char) {
    const nytCode = this.nytNode ? this.nytNode.code : '';
    const charBinary = char.charCodeAt(0).toString(2).padStart(8, '0');
    return nytCode + charBinary;
  }

  _decodeSymbol(binary, startIndex) {
    if (!this.root) {
      if (startIndex + 8 <= binary.length) {
        const charCode = parseInt(binary.substr(startIndex, 8), 2);
        return { symbol: String.fromCharCode(charCode), nextIndex: startIndex + 8 };
      }
      return { symbol: null, nextIndex: startIndex };
    }

    let node = this.root;
    let index = startIndex;

    while (index < binary.length && node.symbol === null) {
      const bit = binary[index];
      node = bit === '0' ? node.left : node.right;
      index++;
      
      if (!node) return { symbol: null, nextIndex: index };
    }

    if (node.symbol === null && node === this.nytNode) {
      if (index + 8 <= binary.length) {
        const charCode = parseInt(binary.substr(index, 8), 2);
        return { symbol: String.fromCharCode(charCode), nextIndex: index + 8 };
      }
    }

    return { symbol: node.symbol || null, nextIndex: index };
  }

  _updateTree(char) {
    if (!this.symbolTable.has(char)) {
      const leaf = new HuffmanNode(char, 1);
      this.symbolTable.set(char, leaf);
      this._insertNewLeaf(leaf);
    } else {
      const node = this.symbolTable.get(char);
      node.freq++;
      this._bubbleUp(node);
    }
  }

  _insertNewLeaf(leaf) {
    if (!this.root) {
      this.root = new HuffmanNode(null, 1);
      this.nytNode = leaf;
      this.root.left = this.nytNode;
      leaf.parent = this.root;
    } else {
      const parent = new HuffmanNode(null, leaf.freq + this.nytNode.freq);
      parent.left = leaf;
      parent.right = this.nytNode;
      leaf.parent = parent;
      this.nytNode.parent = parent;
      this._splice(this.nytNode.parent.parent, this.nytNode.parent);
    }
    this._updateCodes();
  }

  _splice(node, replacement) {
    if (!node) return;
    if (node.left === replacement.parent) {
      node.left = replacement;
    } else {
      node.right = replacement;
    }
    replacement.parent = node;
  }

  _bubbleUp(node) {
    while (node.parent) {
      node.parent.freq++;
      node = node.parent;
    }
    this._updateCodes();
  }

  _updateCodes() {
    this.symbolTable.forEach((node) => {
      node.code = this._generateCode(node);
    });
    if (this.nytNode) {
      this.nytNode.code = this._generateCode(this.nytNode);
    }
  }

  _generateCode(node) {
    let code = '';
    let current = node;
    while (current.parent) {
      code = (current.parent.left === current ? '0' : '1') + code;
      current = current.parent;
    }
    return code || '0';
  }

  _codeLength(node) {
    return node ? node.code.length : 0;
  }

  reset() {
    this.root = null;
    this.nytNode = null;
    this.symbolTable.clear();
  }
}

module.exports = { AdaptiveHuffman, HuffmanNode };

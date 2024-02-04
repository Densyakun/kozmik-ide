/*
ツリー構造のJSONオブジェクトを取得したり、
JSONオブジェクトからノードを設定する。

EndOfFileのコーディングスタイルは保証しない。
*/
import { Node, SourceFile, SyntaxKind, SyntaxList } from 'ts-morph';

export function getChildrenOtherThanComments(node: Node) {
  // コメントが重複しないよう、コメントノードを除く
  return node.getChildren().filter(child =>
    child.getKind() !== SyntaxKind.SingleLineCommentTrivia
    && child.getKind() !== SyntaxKind.MultiLineCommentTrivia
    && child.getKind() !== SyntaxKind.JSDoc
  );
}

export function getFromSourceFile(sourceFile: SourceFile) {
  const children = sourceFile.getChildren();

  return {
    syntaxList: getFromSyntaxList(children[0] as SyntaxList),
    commentRangesAtEndOfFile: children[1].getLeadingCommentRanges().map(commentRange => commentRange.getText()),
  };
}

export function setToSourceFile(sourceFile: SourceFile, json: ReturnType<typeof getFromSourceFile>) {
  // Clear source file
  sourceFile.set({ statements: [] });

  // Add nodes and new comment ranges at end of file
  let text = "";
  function addChildText(nodeJson: NodeJson) {
    if (nodeJson.children)
      nodeJson.children.forEach(childJson => addChildText(childJson));
    else {
      text += nodeJson.fullText;
      if (nodeJson.trailingCommentRanges)
        text += nodeJson.trailingCommentRanges.join('');
    }
  }
  json.syntaxList.children.forEach(childJson => addChildText(childJson));

  // TODO 改行コードを自動でファイルに合わせる
  sourceFile.replaceWithText(
    text
    + (json.commentRangesAtEndOfFile.length ? "\n" : "")
    + json.commentRangesAtEndOfFile.join("\n")
  );
}

export function getFromSyntaxList(syntaxList: SyntaxList) {
  // 次の兄弟要素と重複するため、leadingCommentRangesは含まない
  const children = getChildrenOtherThanComments(syntaxList);

  return {
    kind: syntaxList.getKind(),
    children: children.map((child, index, array) => getFromNode(child, index === array.length - 1)),
  };
}

export type NodeJson = {
  kind: SyntaxKind;
  children?: NodeJson[];
  fullText?: string;
  leadingCommentRanges?: string[];
  trailingCommentRanges?: string[];
};

export function getFromNode(node: Node, isLast: boolean): NodeJson/* | ReturnType<typeof getFromImportDeclaration>*/ {
  // コメントが重複しないよう、親要素に対して末尾の要素である場合のみ、trailingCommentRangesを持つ
  const kind = node.getKind();

  const children = getChildrenOtherThanComments(node);

  return children.length
    ? {
      kind,
      children: children.map((child, index, array) => getFromNode(child, index === array.length - 1)),
    }
    : {
      kind,
      fullText: node.getFullText(),
      leadingCommentRanges: node.getLeadingCommentRanges().map(commentRange => commentRange.getText()),
      trailingCommentRanges: isLast ? node.getTrailingCommentRanges().map(commentRange => commentRange.getText()) : undefined,
    };
}

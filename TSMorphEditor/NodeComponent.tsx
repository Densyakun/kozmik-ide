import { NodeJson } from '@/pages/api/ts-morph/source-file';

export default function NodeComponent({ node }: { node: NodeJson }) {
  return (
    <>
      <p>kind: {node.kindName} ({node.kind})</p>
      {node.children.map(child => <NodeComponent node={child} />)}
    </>
  );
}

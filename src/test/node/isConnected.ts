/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import test from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    child: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    childTwo: new Element(NodeType.ELEMENT_NODE, 'p', HTML_NAMESPACE),
  };
});

test('without a connected parent, tree depth 1 nodes are not connected', t => {
  const { node } = t.context as { node: Element };

  t.is(node.isConnected, false);
});

test('without a connected parent, tree depth > 1 are not connected', t => {
  const { node, child } = t.context as { node: Element; child: Element };

  node.appendChild(child);

  t.is(node.isConnected, false);
  t.is(child.isConnected, false);
});

test('with a connected parent, nodes are connected during append', t => {
  const { node, child, childTwo } = t.context as { node: Element; child: Element; childTwo: Element };

  node.isConnected = true;
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.isConnected, true);
  t.is(child.isConnected, true);
  t.is(childTwo.isConnected, true);
});

test('nodes are disconnected during removal', t => {
  const { node, child, childTwo } = t.context as { node: Element; child: Element; childTwo: Element };

  node.isConnected = true;
  child.appendChild(childTwo);
  node.appendChild(child);
  node.removeChild(child);

  t.is(node.isConnected, true);
  t.is(child.isConnected, false);
  t.is(childTwo.isConnected, false);
});

// 目录节点
import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Content from './Content.vue'

export default Node.create({
    name: 'tableOfContents',

    group: 'block',

    atom: true,

    parseHTML() {
        return [
            {
                tag: 'toc',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['toc', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return VueNodeViewRenderer(Content)
    },

    addGlobalAttributes() {
        return [
            {
                types: [
                    'heading',
                ],
                attributes: {
                    id: {
                        default: null,
                    },
                },
            },
        ]
    },
})
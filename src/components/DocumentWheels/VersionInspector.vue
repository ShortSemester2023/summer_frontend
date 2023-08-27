<template>
    <div id="inspector-wrapper">
        <button @click="showHistoryVersion = !showHistoryVersion">点击按钮</button>
        <ul v-if="showHistoryVersion">
            <li v-for="data in versions" :key="data.versionId">
                <button @click="showVersionContent(data.versionId)">
                    版本编号：{{ data.versionId }} 保存时间：{{ data.saveTime }}</button>
            </li>
        </ul>
        <button v-if="currentVersionId !== undefined" @click="coverDocument">以该版本替换当前文档</button>
        <editor-content :editor="inspector"></editor-content>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import CharactorCount from '@tiptap/extension-character-count'
import Document from '@tiptap/extension-document'
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'//实时渲染markdown
import Highlight from '@tiptap/extension-highlight'//文本高亮
import Placeholder from '@tiptap/extension-placeholder'
import { Color } from '@tiptap/extension-color'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import { lowlight } from 'lowlight'//代码高亮
import CodeBlockLowLight from '@tiptap/extension-code-block-lowlight'//代码高亮
export default {
    components: {
        EditorContent
    },
    data() {
        return {
            showHistoryVersion: false,
            currentVersionId: undefined,
            currentContent: '有一些东西',
            //以下需要对接口
            inspector: undefined
        }
    },
    methods: {
        //展示选择的信息
        showVersionContent(versionId) {
            this.currentVersionId = versionId
            this.$http.get(`/api/projects/file/${this.docId}/version/show/${versionId}`).then((response) => {
                this.currentContent = response.data
                this.inspector.commands.setContent(response.data)
            })
        },
        //覆盖版本，要求向上emit
        coverDocument() {
            this.$http.post(`/api/projects/file/${this.docId}/version/${this.currentVersionId}/`).then(() => {
                this.$emit('updateContent', this.currentContent)
            })
        }

    },
    props: {
        docId: {
            type: Number,
        },
        versions: {
            type: Object,
            default: []
        }
    },
    emits: ['updateContent'],
    mounted() {
        this.inspector = new Editor({
            extensions: [
                Document,
                StarterKit.configure({
                    history: false//使用collaboration的history
                }),
                CharactorCount.configure({
                    limit: this.docLimit
                }),
                Typography,
                Underline,
                Color,
                FontFamily,
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                Text,
                TextStyle,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                CodeBlockLowLight.configure({
                    lowlight,
                }),
                Placeholder.configure(
                    {
                        placeholder: ({ node }) => {
                            return '从这里开始编写文档\n支持Markdown快捷键'
                        }
                    }
                ),
                Highlight.configure({
                    multicolor: true
                })
            ],
            editable: false,
            content: ''
        })
    },
    unmounted() {
        this.inspector.destroy()
    }
}
</script>

<style></style>
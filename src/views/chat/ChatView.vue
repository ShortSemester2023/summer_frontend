<!-- 聊天详情页 -->
<template>
	<div>
		<vue-advanced-chat ref="chat" theme="light" height="calc(100vh - 90px)" :styles="JSON.stringify(styles)"
			:current-user-id="currentUserId" :rooms="JSON.stringify(rooms)" :rooms-loaded="roomsLoaded"
			:messages="JSON.stringify(messages)" :messages-loaded="messagesLoaded" :custom-search-room-enabled="true"
			:room-info-enabled="true" :user-tags-enabled="userTagsEnabled" :load-first-room="$route.query.groupId == undefined"
			:message-selection-actions="JSON.stringify(messageSelectionActions)" @send-message="sendMessage($event.detail[0])"
			@edit-message="editMessage($event.detail[0])" @delete-message="deleteMessage($event.detail[0])"
			@fetch-messages="fetchMessages($event.detail[0])" @search-room="searchRoom($event.detail[0])"
			@open-file="openFile($event.detail[0])" @add-room="addRoom"
			@message-selection-action-handler="messageSelectionActionHandler($event.detail[0])">
		</vue-advanced-chat>
		<CreateGroupRoom :show="showCreateRoomModal" @close="showCreateRoomModal = false"></CreateGroupRoom>
		<TransmitMessage :show="showTransmitMessageModal" :transmitType="transmitType" :rooms="rooms"
			@close="showTransmitMessageModal = false"></TransmitMessage>
		<div v-for="message in combineTransmitInstances" :key="message">
			<CombineTransmit :show="message.show" :combineMessageList="message.combineMessageList"
				@close="closeCombineTransmit"></CombineTransmit>
		</div>
		<GroupDetailModal :groupId="currentRoomId" />
	</div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import CreateGroupRoom from '../../components/Modal/CreateGroupRoom.vue'
import TransmitMessage from '../../components/Modal/TransmitMessage.vue'
import CombineTransmit from '../../components/Modal/CombineTransmit.vue'
import GroupDetailModal from '../../components/Modal/GroupDetailModal.vue'
// import  ChatWindow  from 'vue-advanced-chat'
register()
export default {
	name: 'ChatView',
	// components: { ChatWindow },
	components: { CreateGroupRoom, TransmitMessage, CombineTransmit, GroupDetailModal },
	mounted() {
		this.currentUserId = this.$cookies.get('user_id')
		this.roomsLoaded = false
		this.teamws = new WebSocket(`ws://43.138.14.231:9000/ws/team/${this.$route.params.teamId}/${this.currentUserId}/`)
		this.teamws.onmessage = (messageEvent) => {
			const data = JSON.parse(messageEvent.data)
			if (data.option == 'create') {
				this.handleCreateRoom(data)
			}
			else if (data.option == 'edit') {
				this.handleEditRoom(data)
			}
			else if (data.option == 'delete') {
				this.handleDeleteRoom(data)
			}
			else if (data.option == 'quit') {
				this.handleQuitRoom(data)
			}
			else if (data.option == 'join') {
				this.handleJoinRoom(data)
			}
		}
		this.$http.get(`/api/groups/list_by_team_id/?team_id=${this.$route.params.teamId}`).then((response) => {
			// rooms
			this.rooms = response.data.map((group, index) => ({
				index: -index,
				roomId: group.id,
				roomName: group.is_private ? (
					group.members[0].user.id == this.currentUserId ? group.members[1].user.username : group.members[0].user.username
				) : group.name,
				avatar: group.is_private ? (
					group.members[0].user.id == this.currentUserId ? group.members[1].user.avatar : group.members[0].user.avatar
				) : group.avatar,
				unreadCount: group.unreadCount,
				users: group.members.map((member) => ({
					_id: `${member.user.id}`,
					username: member.user.username
				})),
				lastMessage: group.lastMessage.id == null ? null : {
					_id: group.lastMessage.id,
					content: group.lastMessage.text_content,
					senderId: `${group.lastMessage.sender.user.id}`,
					username: group.lastMessage.sender.user.username,
					avatar: group.lastMessage.sender.user.avatar,
					timestamp: group.lastMessage.create_datetime.substring(11, 16),
					date: group.lastMessage.create_datetime.substring(5, 10),
					new: false,
				},
				is_private: group.is_private,
				identity: group.identity
			}))
			if (this.rooms.length > 0) {
				this.currentRoomId = this.rooms[0].roomId
			}
			this.allRooms = this.rooms
			// @all && last_message
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].identity != 'member') {
					this.rooms[i].users = [
						{
							_id: '0',
							username: '所有人'
						},
						...this.rooms[i].users
					]
				}
				// WebSocket
				this.ws[i] = new WebSocket(`ws://43.138.14.231:9000/ws/chat/group/${this.rooms[i].roomId}/${this.currentUserId}/`)
				this.ws[i].onmessage = (messageEvent) => {
					const data = JSON.parse(messageEvent.data)
					if (data.option == 'send') {
						this.handleSendMessage(i, data)
					}
					else if (data.option == 'edit') {
						this.handleEditMessage(i, data)
					}
					else if (data.option == 'delete') {
						this.handleDeleteMessage(i, data)
					}
				}
			}
			this.roomsLoaded = true
			const groupId = this.$route.query.groupId
			if (groupId != undefined) {
				this.selectRoom(groupId)
				const messageId = this.$route.query.messageId
				if (messageId != undefined) {
					this.fetchAllMessages()
					this.scrollToMessage(messageId)
				}
			}
		})
		// test
		const style = document.createElement('style')
		style.textContent = `
			/* 鼠标悬浮于消息时的操作选项 */
			.vac-options-container {
				/*display: none !important;*/
			}

			.vac-format-message-wrapper {
				padding-right: 40px !important;
			}

			/* 左上角搜索框 */
			.vac-box-search input {
				caret-color: rgba(199,29,35, 1) !important;
			}
			.vac-box-search input::placeholder {
				color: rgba(0,0,0,0) !important;
			}

			/* 列表房间名称 */
			.vac-room-name.vac-text-ellipsis {
				color: rgba(199,29,35, 1) !important;
			}

			/* 聊天室日期显示 */
			.vac-card-info.vac-card-date {
				background: rgba(199,29,35, 0.1) !important;
			}

			/* 聊天室顶部 聊天开始时间 */
			.vac-text-started {
				display: none !important;
			}

			/* “新消息”提示 */ 
			.vac-line-new {
				display: none !important;
			}

			/* 设置聊天室顶部 padding */
			.vac-messages-container {
				padding-top: 20px !important;
			}

			/* 发消息的 textarea */
			.vac-box-footer.vac-box-footer-border textarea {
				caret-color: rgba(199,29,35, 1) !important;
			}
			.vac-box-footer.vac-box-footer-border textarea::placeholder {
				color: rgba(0,0,0,0) !important;
			}

			/* @ 别人的消息颜色 */
			.vac-text-tag {
				color: rgba(199,29,35, 1) !important;
				font-weight: bold !important;
			}

			/* 编辑自己的消息、致使输入框有 outline */
			.vac-textarea-outline {
				border: 0 !important;
				box-shadow: none !important;
				outline: 3px solid rgba(199,29,35, 1) !important;
			}

			/* 选中消息时的 emoji（没效果） */
			.vac-emoji-reaction {
				display: none !important;
			}

			/* 选中消息的小 icon 及其容器 */
			.vac-options-container {
				width: 30px !important;
			}
			.vac-blur-container {
				width: 30px; !important;
				background: transparent !important;
			}
			
			/* 点击消息弹出菜单 */
			.vac-menu-options {
				box-shadow: 3px 3px 10px grey !important;
				color: rgba(199,29,35, 1) !important;
				font-size: 16px !important;
				font-weight: bold !important;
			}

			/* 搜索框右边的加号 */
			.vac-add-icon {
				// display: none !important;
			}

			/* 新消息的提醒颜色*/
			.vac-badge-counter.vac-room-badge {
				background: rgba(199,29,35, 1) !important;
			}

			/* 左侧列表的消息 */
			.vac-text-ellipsis {
				font-weight: 500 !important;
				color: #67717a !important;
			}

			/* header 右边的 ··· */
			.vac-room-header {
				--header-content: '···';
			}
			.vac-room-header::before {
				content: var(--header-content) !important;
				position: absolute !important;
				right: 10px !important;
				font-size: 20px !important;
				color: rgba(199,29,35, 1) !important;
				cursor: pointer !important;
			}

			/* 多选时取消的位置 */
			.vac-selection-cancel {
				margin-right: 50px !important;
				color: rgba(199,29,35, 1) !important;
				font-weight: bold !important;
			}

			.vac-message-box > .vac-avatar {
				height: 35px !important;
				width: 35px !important;
				min-height: 35px !important;
				min-width: 35px !important;
				align-self: flex-start !important;
				margin: 2px 0 0 !important;
			}

			.vac-message-container {
				min-width: 40% !important;
			}

			.vac-message-wrapper .vac-message-container-offset {
				margin: 0 !important;
			}

			em {
				font-style: normal !important;
			}

			/* 被选中消息的样式 */
			div.vac-message-card.vac-item-clickable.vac-message-selected {
				background: white !important;
				border: 2px solid rgba(199,29,35, 1) !important;
				box-sizing: border-box !important;
			}

			/* 多选时顶部按钮背景色 */
			.vac-selection-button {
				background: rgba(199,29,35, 1) !important;
			}

			@keyframes blink {
				from {
					background: white !important;
				}
				50% {
					background: rgba(199,29,35, 0.2) !important;
				}
				to {
					background: white !important;
				}
			}

			.blink-message {
				animation: blink linear 10s forwards;
			}

			.vac-badge-counter.vac-messages-count {
				background: rgba(199,29,35, 1) !important;
			}
		`
		this.$bus.on('fetchAllMessages', () => this.fetchAllMessages())
		this.$bus.on('scrollToMessage', messageId => this.scrollToMessage(messageId))
		this.$bus.on('forwardMessages', transmitList => this.forwardMessages(transmitList))
		this.$bus.on('showCombinedMessageRequest', messageId => this.showCombinedMessages(messageId))
		this.$bus.on('roomOption', data => this.teamws.send(data))

		this.$refs.chat.shadowRoot.appendChild(style)
		// const doc = this.$refs.chat.shadowRoot
		// setTimeout(() => {
		// 	let temp = doc.querySelector('.vac-rooms-empty')
		// 	if (temp) {
		// 		temp.innerHTML = '<div>暂无聊天室</div>'
		// 	}
		// 	temp = doc.querySelector('.vac-col-messages .vac-container-center.vac-room-empty')
		// 	if (temp) {
		// 		temp.innerHTML = '<div>未选中聊天室</div>'
		// 	}
		// }, 1)

		// const newHTML = this.$refs.chat.shadowRoot.innerHTML.replace('placeholder="Search"', 'placeholder="检索"')
		// console.log(newHTML)
		// setTimeout(() => {
		// 	console.log('index: ', this.$refs.chat.shadowRoot.innerHTML.indexOf('Conversation started on: 08-28'))
		// }, 1000)
		// console.log('index: ', this.$refs.chat.shadowRoot.innerHTML.indexOf('Conversation started on: 08-28'))

		document.addEventListener('click', this.changeStyle)
		document.addEventListener('click', this.showGroupInfo)

	},
	beforeUnmount() {
		document.removeEventListener('click', this.changeStyle)
		document.removeEventListener('click', this.showGroupInfo)
	},
	unmounted() {
		this.teamws.close()
		for (let i = 0; i < this.ws.length; i++) {
			this.ws[i].close()
		}
		this.$bus.off('fetchAllMessages')
		this.$bus.off('scrollToMessage')
		this.$bus.off('forwardMessages')
		this.$bus.off('showCombinedMessageRequest')
		this.$bus.off('roomOption')
	},
	data() {
		return {
			teamws: undefined,
			showCreateRoomModal: false,
			showTransmitMessageModal: false,
			showCombinedmessageModal: false,
			combineTransmitInstances: [],
			transmitType: '',
			ws: [],
			currentUserId: '',
			currentRoomId: '',
			rooms: [],
			allRooms: [],
			roomsLoaded: false,
			messages: [],
			messagesLoaded: false,
			messagesToForward: [],
			userTagsEnabled: true,
			messageSelectionActions: [
				{
					name: 'forwardItemByItem',
					title: '逐条转发'
				},
				{
					name: 'forwardCombined',
					title: '合并转发'
				}
			],
			styles: {
				general: {
					backgroundcolorButton: 'rgba(199,29,35, 1)',
				},
				sidemenu: {
					backgroundActive: 'rgba(199,29,35, 0.2)'
				},
				message: {
					background: '#fff',
					backgroundMe: 'rgba(199,29,35, 0.2)',
				},
				icons: {
					search: 'rgba(199,29,35, 1)',
					add: 'rgba(199,29,35, 1)',
					toggle: 'rgba(199,29,35, 1)',
					menu: '#0a0a0a',
					close: 'rgba(199,29,35, 1)',
					closeImage: 'rgba(199,29,35, 1)',
					file: 'rgba(199,29,35, 1)',
					paperclip: 'rgba(199,29,35, 1)',
					closeOutline: 'rgba(199,29,35, 1)',
					closePreview: 'rgba(199,29,35, 1)',
					send: 'rgba(199,29,35, 1)',
					sendDisabled: '#9ca6af',
					emoji: 'rgba(199,29,35, 1)',
					emojiReaction: 'rgba(0, 0, 0, 0.3)',
					document: 'rgba(199,29,35, 1)',
					pencil: '#9e9e9e',
					checkmark: '#9e9e9e',
					checkmarkSeen: '#0696c7',
					eye: '#fff',
					dropdownMessage: '#fff',
					dropdownMessageBackground: 'rgba(0, 0, 0, 0.25)',
					dropdownRoom: '#9e9e9e',
					dropdownScroll: '#0a0a0a',
					microphone: 'rgba(199,29,35, 1)',
					audioPlay: '#455247',
					audioPause: '#455247',
					audioCancel: '#eb4034',
					audioConfirm: '#1ba65b'
				},
				header: {
					background: '#fff',
					colorRoomName: 'rgba(199,29,35, 1)',
					colorRoomInfo: '#9ca6af'
				},
			}
		}
	},
	methods: {
		// 改变列表样式的回调
		changeStyle() {
			let doc = null
			if (this.$refs.chat) {
				doc = this.$refs.chat.shadowRoot
				let list = doc.querySelector('.vac-menu-list')

				if (list) {
					if (list.children.length === 2) {
						list.children[0].children[0].innerHTML = '引用'
						list.children[1].children[0].innerHTML = '多选'
						// list.children[1].style.display = 'none'
					} else if (list.children.length === 4) {
						list.children[0].children[0].innerHTML = '引用'
						list.children[1].children[0].innerHTML = '编辑'
						list.children[2].children[0].innerHTML = '撤回'
						list.children[3].children[0].innerHTML = '多选'
						// list.children[3].style.display = 'none'
					}
				}
				setTimeout(() => {
					let cancel = doc.querySelector('.vac-selection-cancel')
					if (cancel) {
						cancel.innerHTML = '取消'
					}
				}, 300);

			}
		},

		showGroupInfo(e) {
			e.stopPropagation()
			const x = e.clientX
			const y = e.clientY
			let doc = null
			if (this.$refs.chat) {
				doc = this.$refs.chat.shadowRoot
			}
			let header = doc.querySelector('.vac-room-header')
			if (header) {
				const right = header.getBoundingClientRect().right
				const top = header.getBoundingClientRect().top
				if (right - 50 <= x && x <= right - 10 && top + 15 <= y && y <= top + 40) {
					if (this.userTagsEnabled) {
						this.$bus.emit('showGroupDetail')
					}
				}
			}
		},

		fetchMessages({ room, options = {} }) {
			this.currentRoomId = room.roomId
			if (room.roomId == this.$route.query.groupId) {
				return
			}
			const offset = options.reset ? 0 : this.messages.length
			if (options.reset) {
				this.messages = []
				this.messagesLoaded = false
				for (let i = 0; i < this.rooms.length; i++) {
					if (this.rooms[i].roomId == room.roomId) {
						this.rooms[i].unreadCount = 0
						this.userTagsEnabled = !this.rooms[i].is_private
						break
					}
				}
			}
			setTimeout(() => {
				if (!this.userTagsEnabled) {
					this.$refs.chat.shadowRoot.querySelector('.vac-room-header').style.setProperty('--header-content', '···')
				} else {
					this.$refs.chat.shadowRoot.querySelector('.vac-room-header').style.setProperty('--header-content', '')
				}
			}, 100)
			this.$http.get(`/api/groups/${room.roomId}/messages/?limit=30&offset=${offset}`).then((response) => {
				if (response.data.results.length == 0) {
					this.messagesLoaded = true
				}
				const messages = response.data.results.map((message) => ({
					_id: message.id,
					content: message.text_content,
					senderId: `${message.sender.user.id}`,
					username: message.sender.user.username,
					avatar: message.sender.user.avatar,
					timestamp: message.create_datetime.substring(11, 16),
					date: message.create_datetime.substring(5, 10),
					new: false,
					replyMessage: message.reply_message == null ? null : {
						_id: message.reply_message.id,
						content: message.reply_message.text_content,
						senderId: `${message.reply_message.sender.user.id}`,
						username: message.reply_message.sender.user.username,
						avatar: message.reply_message.sender.user.avatar,
						timestamp: message.reply_message.create_datetime.substring(11, 16),
						date: message.reply_message.create_datetime.substring(5, 10),
						new: false,
						files: message.reply_message.file_content == null ? null : [{
							name: message.reply_message.file_content.name.split('message/file/')[1],
							size: message.reply_message.file_content.size,
							url: message.reply_message.file_content.url,
							type: message.reply_message.file_content.name.split('.')[1]
						}]
					},
					files: message.file_content == null ? null : [{
						name: message.file_content.name.split('message/file/')[1],
						size: message.file_content.size,
						url: message.file_content.url,
						type: message.file_content.name.split('.')[1]
					}],
					forwardMessages: message.forward_messages
				})).reverse()
				if (options.reset) {
					this.messages = messages
				}
				else {
					this.messages = [...messages, ...this.messages]
				}
				setTimeout(() => {
					for (let i = 0; i < this.messages.length; i++) {
						if (this.messages[i].forwardMessages.length != 0) {
							this.loadCombinedMessages(i)
						}
					}
				}, 1000);
			})
		},

		handleSendMessage(i, data) {
			const message = data.message
			this.rooms[i].lastMessage = {
				_id: message.id,
				content: message.text_content,
				senderId: `${message.sender.user.id}`,
				username: message.sender.user.username,
				avatar: message.sender.user.avatar,
				timestamp: message.create_datetime.substring(11, 16),
				date: message.create_datetime.substring(5, 10),
				new: false,
				replyMessage: message.reply_message == null ? null : {
					_id: message.reply_message.id,
					content: message.reply_message.text_content,
					senderId: `${message.reply_message.sender.user.id}`,
					username: message.reply_message.sender.user.username,
					avatar: message.reply_message.sender.user.avatar,
					timestamp: message.reply_message.create_datetime.substring(11, 16),
					date: message.reply_message.create_datetime.substring(5, 10),
					new: false,
					files: message.reply_message.file_content == null ? null : [{
						name: message.reply_message.file_content.name.split('message/file/')[1],
						size: message.reply_message.file_content.size,
						url: message.reply_message.file_content.url,
						type: message.reply_message.file_content.name.split('.')[1]
					}]
				},
				files: message.file_content == null ? null : [{
					name: message.file_content.name.split('message/file/')[1],
					size: message.file_content.size,
					url: message.file_content.url,
					type: message.file_content.name.split('.')[1]
				}]
			}
			if (this.currentRoomId != this.rooms[i].roomId) {
				if (message.sender.user.id != this.currentUserId) {
					this.rooms[i].unreadCount++
				}
			}
			else {
				this.$http.post(`/api/groups/${this.currentRoomId}/messages/read_all/`)
				this.messages = [
					...this.messages,
					this.rooms[i].lastMessage
				]
				if (message.forward_messages.length != 0) {
					setTimeout(() => {
						this.loadCombinedMessages(this.messages.length - 1)
					});
				}
			}
			for (let j = 0; j < this.rooms.length; j++) {
				if (this.rooms[j].index > this.rooms[i].index) {
					this.rooms[j].index--
				}
			}
			this.rooms[i].index = 0
			// @
			for (let j = 0; j < data.mentioned_users.length; j++) {
				if ((data.mentioned_users[j]._id == this.currentUserId || data.mentioned_users[j]._id == '0')
					&& message.sender.user.id != parseInt(this.currentUserId)) {
					let formData = new FormData()
					formData.append('group_message', message.id)
					formData.append('receiver', this.currentUserId)
					formData.append('sender', parseInt(message.sender.user.id))
					this.$http.post('/api/news/', formData).then(
						response => {
							this.$bus.emit('message', {
								title: `群聊：${message.group_name} 收到消息`,
								content: `${message.sender.user.username} @了你`,
								time: 3000
							})
							this.$bus.emit('judgeHasUnreadMsg', true)
						}
					)
					break
				}
			}
		},

		sendMessage(message) {
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == message.roomId) {
					if (message.files != null) {
						const reader = new FileReader()
						reader.onload = (event) => {
							this.ws[i].send(JSON.stringify({
								'option': 'send',
								'text_content': message.content,
								'mentioned_users': message.usersTag,
								'reply_message': message.replyMessage,
								'file_content': event.target.result.split('base64,')[1],
								'file_name': message.files[0].name + '.' + message.files[0].extension
							}))
						}
						reader.readAsDataURL(message.files[0].blob)
					}
					else {
						this.ws[i].send(JSON.stringify({
							'option': 'send',
							'text_content': message.content,
							'mentioned_users': message.usersTag,
							'reply_message': message.replyMessage,
							'file_content': null,
							'file_name': null
						}))
					}
					break
				}
			}
		},

		handleEditMessage(i, data) {
			const message = data.message
			const newMessage = {
				_id: message.id,
				content: message.text_content,
				senderId: `${message.sender.user.id}`,
				username: message.sender.user.username,
				avatar: message.sender.user.avatar,
				timestamp: message.create_datetime.substring(11, 16),
				date: message.create_datetime.substring(5, 10),
				new: false,
				replyMessage: message.reply_message == null ? null : {
					_id: message.reply_message.id,
					content: message.reply_message.text_content,
					senderId: `${message.reply_message.sender.user.id}`,
					username: message.reply_message.sender.user.username,
					avatar: message.reply_message.sender.user.avatar,
					timestamp: message.reply_message.create_datetime.substring(11, 16),
					date: message.reply_message.create_datetime.substring(5, 10),
					new: false,
					files: message.reply_message.file_content == null ? null : [{
						name: message.reply_message.file_content.name.split('message/file/')[1],
						size: message.reply_message.file_content.size,
						url: message.reply_message.file_content.url,
						type: message.reply_message.file_content.name.split('.')[1]
					}]
				},
				files: message.file_content == null ? null : [{
					name: message.file_content.name.split('message/file/')[1],
					size: message.file_content.size,
					url: message.file_content.url,
					type: message.file_content.name.split('.')[1]
				}]
			}
			if (this.rooms[i].lastMessage != null) {
				if (this.rooms[i].lastMessage._id == message.id) {
					this.rooms[i].lastMessage = newMessage
				}
			}
			if (this.currentRoomId == this.rooms[i].roomId) {
				for (let i = 0; i < this.messages.length; i++) {
					if (this.messages[i]._id == message.id) {
						this.messages[i] = newMessage
						break
					}
				}
			}
			// @
			for (let j = 0; j < data.mentioned_users.length; j++) {
				if ((data.mentioned_users[j]._id == this.currentUserId || data.mentioned_users[j]._id == '0')
					&& message.sender.user.id != parseInt(this.currentUserId)) {
					let formData = new FormData()
					formData.append('group_message', message.id)
					formData.append('receiver', this.currentUserId)
					formData.append('sender', parseInt(message.sender.user.id))
					this.$http.post('/api/news/', formData).then(
						response => {
							this.$bus.emit('message', {
								title: `文档：${message.group_name} 收到消息`,
								content: `${message.sender.user.username} @了你`,
								time: 3000
							})
							this.$bus.emit('judgeHasUnreadMsg', true)
						})
					break
				}
			}
		},

		editMessage(message) {
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == message.roomId) {
					if (message.files != null && 'blob' in message.files[0]) {
						const reader = new FileReader()
						reader.onload = (event) => {
							this.ws[i].send(JSON.stringify({
								'option': 'edit',
								'edit_file': true,
								'message_id': message.messageId,
								'text_content': message.newContent,
								'mentioned_users': message.usersTag,
								'reply_message': message.replyMessage,
								'file_content': event.target.result.split('base64,')[1],
								'file_name': message.files[0].name + '.' + message.files[0].extension
							}))
						}
						reader.readAsDataURL(message.files[0].blob)
					}
					else {
						this.ws[i].send(JSON.stringify({
							'option': 'edit',
							'edit_file': message.files == null,
							'message_id': message.messageId,
							'text_content': message.newContent,
							'mentioned_users': message.usersTag,
							'reply_message': message.replyMessage,
							'file_content': null,
							'file_name': null
						}))
					}
					break
				}
			}
		},

		handleDeleteMessage(i, data) {
			const message = data.message
			if (this.rooms[i].lastMessage != null) {
				if (this.rooms[i].lastMessage._id == message.id) {
					this.rooms[i].lastMessage.content = '撤回了一条消息'
				}
			}
			if (this.currentRoomId == this.rooms[i].roomId) {
				this.messages = this.messages.filter(msg => msg._id != message.id)
			}
		},

		deleteMessage(message) {
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == message.roomId) {
					this.ws[i].send(JSON.stringify({
						'option': 'delete',
						'message_id': message.message._id,
					}))
				}
			}
		},

		openFile({ message, file }) {
			if (file.action == 'download') {
				const a = document.createElement('a')
				a.style.display = 'none'
				a.download = file.file.name
				a.href = file.file.url
				a.click()
				a.remove()
			}
		},

		searchRoom(event) {
			const tmpRooms = this.allRooms.filter(room => room.roomName.includes(event.value))
			if (tmpRooms.length != 0) {
				this.rooms = tmpRooms
			}
			else {
				this.rooms = this.allRooms
			}
		},

		fetchAllMessages() {
			this.$http.get(`/api/groups/${this.currentRoomId}/messages/`).then((response) => {
				this.messages = response.data.map((message) => ({
					_id: message.id,
					content: message.text_content,
					senderId: `${message.sender.user.id}`,
					username: message.sender.user.username,
					avatar: message.sender.user.avatar,
					timestamp: message.create_datetime.substring(11, 16),
					date: message.create_datetime.substring(5, 10),
					new: false,
					replyMessage: message.reply_message == null ? null : {
						_id: message.reply_message.id,
						content: message.reply_message.text_content,
						senderId: `${message.reply_message.sender.user.id}`,
						username: message.reply_message.sender.user.username,
						avatar: message.reply_message.sender.user.avatar,
						timestamp: message.reply_message.create_datetime.substring(11, 16),
						date: message.reply_message.create_datetime.substring(5, 10),
						new: false,
						files: message.reply_message.file_content == null ? null : [{
							name: message.reply_message.file_content.name.split('message/file/')[1],
							size: message.reply_message.file_content.size,
							url: message.reply_message.file_content.url,
							type: message.reply_message.file_content.name.split('.')[1]
						}]
					},
					files: message.file_content == null ? null : [{
						name: message.file_content.name.split('message/file/')[1],
						size: message.file_content.size,
						url: message.file_content.url,
						type: message.file_content.name.split('.')[1]
					}],
					forwardMessages: message.forward_messages
				})).reverse()
				this.messagesLoaded = true
				setTimeout(() => {
					for (let i = 0; i < this.messages.length; i++) {
						if (this.messages[i].forwardMessages.length != 0) {
							this.loadCombinedMessages(i)
						}
					}
				}, 1000);
			})
		},

		scrollToMessage(messageId) {
			setTimeout(() => {
				let i = 0
				for (; i < this.messages.length; i++) {
					if (this.messages[i]._id == messageId) {
						break
					}
				}
				i++
				console.log(i)
				if (this.$refs.chat) {
					const doc = this.$refs.chat.shadowRoot
					const container = doc.querySelector('#messages-list')
					const msg = doc.querySelector(`#messages-list>div>div>span>div:nth-child(${i})`)
					if (container && msg) {
						// console.log('msg: ', msg.getBoundingClientRect().top, msg.getBoundingClientRect().bottom)
						// console.log('con: ', container.getBoundingClientRect().top, container.getBoundingClientRect().bottom)
						// console.log('@@@: ', container.scrollTop)
						const msgHeight = msg.getBoundingClientRect().bottom - msg.getBoundingClientRect().top
						const offset = (container.getBoundingClientRect().top + container.getBoundingClientRect().bottom) / 2
						container.scrollTo({
							top: container.scrollTop + msg.getBoundingClientRect().top - offset + msgHeight / 2,
							left: 0,
							behavior: 'smooth'
						})
					}
				}
			}, 500);
		},

		selectRoom(roomId) {
			this.$nextTick(() => {
				this.currentRoomId = roomId
				let i = 0
				for (; i < this.rooms.length; i++) {
					if (this.rooms[i].roomId == roomId) {
						break
					}
				}
				i++
				if (this.$refs.chat) {
					const doc = this.$refs.chat.shadowRoot
					const item = doc.querySelector(`#rooms-list>div:nth-child(${i})`)
					item.click()
				}
			});
		},

		addRoom() {
			this.showCreateRoomModal = true
		},

		forwardMessages(transmitList) {
			for (const group of transmitList) {
				this.ws[group.index].send(JSON.stringify({
					'option': this.transmitType,
					'messages': this.messagesToForward
				}))
			}
		},

		messageSelectionActionHandler({ roomId, action, messages }) {
			this.messagesToForward = messages.map(message => message._id)
			this.messagesToForward.sort((a, b) => a - b)
			switch (action.name) {
				case 'forwardItemByItem':
					this.transmitType = 'forwardItemByItem'
					this.showTransmitMessageModal = true
					break
				case 'forwardCombined':
					this.transmitType = 'forwardCombined'
					this.showTransmitMessageModal = true
					break
			}
		},

		loadCombinedMessages(i) {
			if (this.$refs.chat) {
				const doc = this.$refs.chat.shadowRoot
				const msg = doc.querySelector(`#messages-list>div>div>span>div:nth-child(${i + 1})`)
				const span = msg.querySelector('.vac-format-container>span>span')
				span.style.cursor = 'pointer'
				span.style.fontWeight = 'bold'
				span.style.color = 'gray'
				span.onclick = () => this.showCombinedMessages(this.messages[i]._id)
			}
		},

		showCombinedMessages(messageId) {
			this.$http.get(`/api/groups/messages/${messageId}/`).then((response) => {
				const combinedMessage = response.data.forward_messages.map((message) => ({
					id: message.id,
					avatar: message.sender.user.avatar,
					username: message.sender.user.username,
					time: message.create_datetime,
					content: message.text_content,
					fileContent: message.file_content,
					isPravite: message.group_is_private,
					groupName: message.group_name,
					isCombined: message.forward_messages.length == 0 ? false : true
				}))
				combinedMessage.sort((a, b) => a.id - b.id)
				this.openNewCombineTransmit(combinedMessage)
			})
		},
		// 打开一个合并转发消息的模态框
		openNewCombineTransmit(message) {
			const newCombineTransmit = {
				show: true,
				combineMessageList: message, // 设置合并消息列表
			};
			console.log(message);
			this.combineTransmitInstances.push(newCombineTransmit);
		},
		// 关闭一个合并转发消息的模态框
		closeCombineTransmit() {
			this.combineTransmitInstances.pop()
		},

		handleCreateRoom(data) {
			const group = data.group_data
			for (let j = 0; j < group.members.length; j++) {
				if (group.members[j].user.id == parseInt(this.currentUserId)) {
					createRoom(group)
					return
				}
			}
		},

		createRoom(group) {
			for (let j = 0; j < this.rooms.length; j++) {
				this.rooms[j].index--
			}
			const room = {
				index: 0,
				roomId: group.id,
				roomName: group.is_private ? (
					group.members[0].user.id == this.currentUserId ? group.members[1].user.username : group.members[0].user.username
				) : group.name,
				avatar: group.is_private ? (
					group.members[0].user.id == this.currentUserId ? group.members[1].user.avatar : group.members[0].user.avatar
				) : group.avatar,
				unreadCount: group.unreadCount,
				users: group.members.map((member) => ({
					_id: `${member.user.id}`,
					username: member.user.username
				})),
				is_private: group.is_private,
			}
			if (group.creator == this.currentUserId) {
				room.users = [
					{
						_id: '0',
						username: '所有人'
					},
					...room.users
				]
			}
			this.rooms = [...this.rooms, room]
			const i = this.rooms.length - 1
			this.ws[i] = new WebSocket(`ws://43.138.14.231:9000/ws/chat/group/${room.roomId}/${this.currentUserId}/`)
			this.ws[i].onmessage = (messageEvent) => {
				const data = JSON.parse(messageEvent.data)
				if (data.option == 'send') {
					this.handleSendMessage(i, data)
				}
				else if (data.option == 'edit') {
					this.handleEditMessage(i, data)
				}
				else if (data.option == 'delete') {
					this.handleDeleteMessage(i, data)
				}
			}
		},

		handleEditRoom(data) {
			const group = data.group_data
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == group.id) {
					this.rooms[i].roomName = group.name
					this.rooms[i].avatar = group.avatar
					break
				}
			}
		},

		handleDeleteRoom(data) {
			const group = data.group_data
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == group.id) {
					this.rooms.splice(i, 1)
					this.ws.splice(i, 1)
					break
				}
			}
		},

		handleQuitRoom(data) {
			const group = data.group_data
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == group.id) {
					if (this.currentUserId == group.user_id) {
						this.rooms.splice(i, 1)
						this.ws.splice(i, 1)
					}
					else {
						this.rooms[i].users = this.rooms[i].users.filter(user => user._id != group.user_id)
					}
					break
				}
			}
		},

		handleJoinRoom(data) {
			const group = data.group_data
			for (let i = 0; i < this.rooms.length; i++) {
				if (this.rooms[i].roomId == group.id) {
					this.rooms[i].users = group.members.map((member) => ({
						_id: `${member.user.id}`,
						username: member.user.username
					}))
					return
				}
			}
			group['creator'] = null
			createRoom(group)
			if (group.lastMessage != null) {
				this.rooms[this.rooms.length - 1].lastMessage = {
					_id: group.lastMessage.id,
					content: group.lastMessage.text_content,
					senderId: `${group.lastMessage.sender.user.id}`,
					username: group.lastMessage.sender.user.username,
					avatar: group.lastMessage.sender.user.avatar,
					timestamp: group.lastMessage.create_datetime.substring(11, 16),
					date: group.lastMessage.create_datetime.substring(5, 10),
					new: false,
				}
			}
		}
	}
}
</script>

<style scoped>
body {
	font-family: 'Quicksand', sans-serif;
}
</style>
<template>
    <div class="encrypt">
        <v-flex offset-xs1 xs10>
            <v-card class="mb-4">
                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0" color="primary">Encrypt</h3>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-tabs grow slot="extension" v-model="tab">
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab>Text Encrypt</v-tab>
                        <v-tab>File Encrypt</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text>
                                    <v-form v-model="textEncryptValid">
                                        <v-textarea :rules="textEncryptTextRules" box label="Text to Encrypt"
                                                    prepend-icon='text_format' v-model="textEncryptText"></v-textarea>
                                        <v-text-field :rules="textEncryptKeyRules" box label="Key"
                                                      prepend-icon='vpn_key' v-model="textEncryptKey"></v-text-field>
                                        <v-btn @click="socketEncryptByText" block color="primary" large>Encrypt</v-btn>
                                    </v-form>
                                    <v-progress-linear :indeterminate="true"
                                                       v-if="encryptByTextLoading"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text>
                                    <v-form v-model="fileEncryptValid">
                                        <v-text-field :rules="fileEncryptFileRules" @click='pickFile' box
                                                      label="Select File" prepend-icon='attach_file'
                                                      v-model='fileName'></v-text-field>
                                        <input @change="onFilePicked" accept=".txt" ref="image" style="display: none"
                                               type="file">
                                        <v-text-field :rules="fileEncryptKeyRules" box label="Key"
                                                      prepend-icon='vpn_key' v-model="fileEncryptKey"></v-text-field>
                                        <v-btn @click="socketEncryptByFile" block color="primary" large>Encrypt</v-btn>
                                    </v-form>
                                    <v-progress-linear :indeterminate="true"
                                                       v-if="encryptByFileLoading"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex offset-xs1 v-if="showEncrypted" xs10>
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0" color="primary">Encrypted Text</h3>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-textarea box label="Encrypted Text" readonly v-model="encryptedText"></v-textarea>
                        <v-text-field box label="Runtime" readonly suffix="miliseconds"
                                      v-model="runtime"></v-text-field>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
    import io from 'socket.io-client'

    export default {
        name: 'Encrypt',
        data: () => ({
            socket: null,
            showEncrypted: false,
            textEncryptValid: false,
            textEncryptText: '',
            textEncryptTextRules: [v => !!v || 'Text is required'],
            textEncryptKey: '',
            textEncryptKeyRules: [v => !!v || 'Key is required'],
            encryptByTextLoading: false,
            fileEncryptValid: false,
            fileEncryptFile: '',
            fileEncryptFileRules: [v => !!v || 'File is required'],
            fileEncryptKey: '',
            fileEncryptKeyRules: [v => !!v || 'Key is required'],
            encryptByFileLoading: false,
            tab: null,
            fileName: '',
            fileUrl: '',
            encryptedText: '',
            runtime: ''
        }),
        beforeDestroy() {
            this.socket.emit(`STOP_ALL_PROCESS`)
            this.socket.disconnect()
        },
        mounted() {
            this.socket = io.connect(this.$socketPath)
            this.socket.on('RESULT_ENCRYPT_BY_TEXT', (data) => {
                this.encryptByTextLoading = false
                this.showEncrypted = true
                this.encryptedText = data.enc
                this.runtime = data.runtime
            })
            this.socket.on('RESULT_ENCRYPT_BY_FILE', (data) => {
                this.encryptByFileLoading = false
                this.showEncrypted = true
                this.encryptedText = data.enc
                this.runtime = data.runtime
            })
        },
        methods: {
            socketEncryptByText() {
                if (this.textEncryptValid) {
                    this.encryptByTextLoading = true
                    this.showEncrypted = false
                    this.socket.emit('ENCRYPT_BY_TEXT', {
                        plainText: this.textEncryptText,
                        key: this.textEncryptKey
                    })
                }
            },
            socketEncryptByFile() {
                if (this.fileEncryptValid) {
                    this.encryptByFileLoading = true
                    this.showEncrypted = false
                    this.socket.emit('ENCRYPT_BY_FILE', {
                        fileBase64: this.fileUrl,
                        key: this.fileEncryptKey
                    })
                }
            },
            pickFile() {
                this.$refs.image.click()
            },
            onFilePicked(e) {
                const files = e.target.files
                if (files[0] !== undefined) {
                    this.fileName = files[0].name
                    if (this.fileName.lastIndexOf('.') <= 0) {
                        return
                    }
                    const fr = new FileReader()
                    fr.readAsDataURL(files[0])
                    fr.addEventListener('load', () => {
                        this.fileUrl = fr.result
                    })
                } else {
                    this.fileName = ''
                    this.fileUrl = ''
                }
            }
        }
    }
</script>

<template>
    <div class="Decrypt">
        <v-flex offset-xs1 xs10>
            <v-card class="mb-4">
                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0" color="primary">Decrypt</h3>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-tabs grow slot="extension" v-model="tab">
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab>Text Decrypt</v-tab>
                        <v-tab>File Decrypt</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text>
                                    <v-form v-model="textDecryptValid">
                                        <v-textarea
                                                :rules="textDecryptTextRules"
                                                auto-grow
                                                box
                                                label="Text to Decrypt"
                                                name="input-7-1"
                                                prepend-icon='text_format'
                                                v-model="textDecryptText"
                                        ></v-textarea>
                                        <v-text-field
                                                :rules="textDecryptKeyRules"
                                                box
                                                label="Key"
                                                prepend-icon='vpn_key'
                                                v-model="textDecryptKey"
                                        ></v-text-field>
                                        <v-btn @click="socketDecryptByText" block color="primary" large>Decrypt</v-btn>
                                    </v-form>
                                    <v-progress-linear :indeterminate="true"
                                                       v-if="decryptByTextLoading"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text>
                                    <v-form v-model="fileDecryptValid">
                                        <v-text-field :rules="fileDecryptFileRules" @click='pickFile' box
                                                      label="Select File" prepend-icon='attach_file'
                                                      v-model='fileName'></v-text-field>
                                        <input
                                                @change="onFilePicked"
                                                accept=".txt"
                                                ref="image"
                                                style="display: none"
                                                type="file"
                                        >
                                        <v-text-field
                                                :rules="fileDecryptKeyRules"
                                                box
                                                label="Key"
                                                prepend-icon='vpn_key'
                                                v-model="fileDecryptKey"
                                        ></v-text-field>
                                        <v-btn @click="socketDecryptByFile" block color="primary" large>Decrypt</v-btn>
                                    </v-form>
                                    <v-progress-linear :indeterminate="true"
                                                       v-if="decryptByFileLoading"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex offset-xs1 v-if="showDecrypted" xs10>
            <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0" color="primary">Decrypted Text</h3>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-textarea
                                auto-grow
                                box
                                label="Decrypted Text"
                                readonly
                                v-model="decryptedText"
                        ></v-textarea>
                        <v-text-field
                                box
                                label="Runtime"
                                readonly
                                suffix="miliseconds"
                                v-model="runtime"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
    import io from 'socket.io-client'

    export default {
        name: 'Decrypt',
        data: () => ({
            socket: null,

            showDecrypted: false,

            textDecryptValid: false,
            textDecryptText: '',
            textDecryptTextRules: [
                v => !!v || 'Text is required',
            ],
            textDecryptKey: '',
            textDecryptKeyRules: [
                v => !!v || 'Key is required',
            ],
            decryptByTextLoading: false,

            fileDecryptValid: false,
            fileDecryptFile: '',
            fileDecryptFileRules: [
                v => !!v || 'File is required',
            ],
            fileDecryptKey: '',
            fileDecryptKeyRules: [
                v => !!v || 'Key is required',
            ],
            decryptByFileLoading: false,

            tab: null,
            fileName: '',
            fileUrl: '',

            decryptedText: '',
            runtime: ''
        }),
        mounted() {
            this.socket = io.connect('sofe3770api.tk')
            this.socket.on('RESULT_DECRYPT_BY_TEXT', (data) => {
                this.decryptByTextLoading = false
                this.showDecrypted = true
                this.decryptedText = data.plainText
                this.runtime = data.runtime
            })
            this.socket.on('RESULT_DECRYPT_BY_FILE', (data) => {
                this.decryptByTextLoading = false
                this.showDecrypted = true
                this.decryptedText = data.plainText
                this.runtime = data.runtime
            })
        },
        methods: {
            socketDecryptByText() {
                if (this.textDecryptValid) {
                    this.decryptByTextLoading = true
                    this.socket.emit('DECRYPT_BY_TEXT', {
                        enc: this.textDecryptText,
                        key: this.textDecryptKey
                    })
                }
            },
            socketDecryptByFile() {
                if (this.fileDecryptValid) {
                    this.decryptByFileLoading = true
                    this.socket.emit('DECRYPT_BY_FILE', {
                        fileBase64: this.fileUrl,
                        key: this.fileDecryptKey
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

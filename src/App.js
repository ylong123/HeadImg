import React, { Component } from 'react'
import { Dialog, Popup, Toast, Button } from 'antd-mobile'
import {
  StopOutline,
  ExclamationTriangleOutline,
  UserOutline
} from 'antd-mobile-icons'
import { Debounce } from './utils'
import './App.css'

export default class App extends Component {
  state = {
    clsType: null,
    style: {
      background: 'none'
    },
    hasUpload: false,
    isOpen: false
  }
  openPopup = isOpen => {
    return () => {
      this.setState({ isOpen })
    }
  }
  changeType = type => {
    return () => {
      this.setState({
        clsType: type
      })
    }
  }
  selectFile = () => {
    const { files } = this.fileRef
    if (files && files.length) {
      const file = files[0]
      let isOk = true
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) < 0) {
        Toast.show({
          content: '上传图片仅支持 png、jpg 和 jpeg 等类型图片！',
          icon: <ExclamationTriangleOutline />,
          duration: 5000
        })
        isOk = false
      }
      if (isOk && file.size / 1024 > 5 * 1024) {
        Toast.show({
          content: '上传图片大小不可超过 5M！',
          icon: <ExclamationTriangleOutline />,
          duration: 5000
        })
        isOk = false
      }
      if (isOk) {
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = ev => {
          this.setState({
            style: {
              background: `url(${ev.target.result}) no-repeat 0 0/100% 100%`
            },
            hasUpload: true
          })
        }
      }
    }
  }
  downloadFile = Debounce(() => {
    if (this.state.hasUpload) {
      window
        .html2canvas(this.frameRef, {
          scale: 2,
          useCORS: true
        })
        .then(canvas => {
          let src = canvas.toDataURL()
          setTimeout(() => {
            Dialog.alert({
              title: '保存图片',
              content: (
                <>
                  <img src={src} alt='' style={{ width: '100%' }} />
                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}
                  >
                    长按保存图片
                  </p>
                </>
              )
            })
          }, 200)
        })
    }
  })
  render () {
    const { style, hasUpload, clsType, isOpen } = this.state
    const types = [
      'none',
      'circle',
      'circle2',
      'square',
      'square2',
      'oblong',
      'oblong2',
      'linear',
      'vertical',
      'diagonal'
    ].reverse()

    return (
      <div className='app'>
        <div className='body'>
          <div className='main'>
            <div className='frame' ref={frame => (this.frameRef = frame)}>
              <div className={`flag ${clsType}`}></div>
              <div className='head' style={style}></div>
              {hasUpload ? (
                ''
              ) : (
                <div className='default'>
                  <UserOutline />
                </div>
              )}
            </div>
            <div className='hidden'>
              <input
                ref={file => (this.fileRef = file)}
                type='file'
                onChange={this.selectFile}
                accept='image/jpeg,image/jpg,image/png'
              />
            </div>
            <div className='options'>
              <Button
                color='success'
                size='small'
                onClick={this.openPopup(true)}
              >
                选择样式
              </Button>
              <Button
                color='warning'
                size='small'
                onClick={() => {
                  this.fileRef.click()
                }}
              >
                上传头像
              </Button>
            </div>
            <div className='hint'>
              <p>支持类型：png，jpg，jpeg</p>
              <p>图片大小：不超过 5M</p>
              <p>建议比例：1：1</p>
            </div>
          </div>
          <Button
            block
            disabled={!hasUpload}
            color='primary'
            onClick={this.downloadFile}
          >
            下载
          </Button>
        </div>
        <Popup
          visible={isOpen}
          onMaskClick={this.openPopup(false)}
          bodyStyle={{ minHeight: '50vh' }}
        >
          {types.map((type, index) => {
            return (
              <div
                key={index}
                className='popup-item'
                onClick={this.changeType(type)}
              >
                <div className={`item ${type}`}>
                  {type === 'none' ? <StopOutline /> : ''}
                </div>
              </div>
            )
          })}
        </Popup>
      </div>
    )
  }
}

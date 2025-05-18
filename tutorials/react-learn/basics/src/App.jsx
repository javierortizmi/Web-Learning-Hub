// App.jsx
import { useState } from 'react'
import './App.css'

const Avatar = ({ hat, glasses, color }) => {
  return (
    <div className="avatar-container">
      {/* Cabeza */}
      <div className="avatar-head" style={{ backgroundColor: color }}>
        {/* Accesorios */}
        {hat && <div className={`avatar-hat ${hat}`} />}
        {glasses && <div className={`avatar-glasses ${glasses}`} />}
      </div>
    </div>
  )
}

const AccessoryController = ({ type, options, selected, onSelect }) => {
  return (
    <div className="controller">
      <h3>{type}</h3>
      <div className="options-grid">
        {options.map((option) => (
          <button
            key={option}
            className={`option ${selected === option ? 'selected' : ''}`}
            onClick={() => onSelect(option === selected ? null : option)}
          >
            {option ? option : '❌'}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [avatarConfig, setAvatarConfig] = useState({
    hat: null,
    glasses: null,
    color: '#ffd700'
  })

  const hats = ['witch', 'crown', 'baseball']
  const glasses = ['round', 'square', 'sunglasses']
  const colors = ['#ffd700', '#ff9999', '#7ebc89', '#9c88ff']

  return (
    <div className="main-container">
      <h1>✨ Avatar Customizer ✨</h1>
      
      <div className="editor">
        <div className="preview">
          <Avatar {...avatarConfig} />
        </div>
        
        <div className="controls">
          <AccessoryController
            type="Hats"
            options={hats}
            selected={avatarConfig.hat}
            onSelect={(hat) => setAvatarConfig({...avatarConfig, hat})}
          />
          
          <AccessoryController
            type="Glasses"
            options={glasses}
            selected={avatarConfig.glasses}
            onSelect={(glasses) => setAvatarConfig({...avatarConfig, glasses})}
          />
          
          <div className="controller">
            <h3>Skin Color</h3>
            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => setAvatarConfig({...avatarConfig, color})}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className='footer'>
        <p>Made with ❤️ by <a href="https://www.javierortizmi.com/" target="_blank" rel="noopener noreferrer">Javier Ortiz Millan</a></p>
        <p>Source code available on <a href="https://github.com/javierortizmi/web-development/tree/main/react-learn/basics" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  )
}
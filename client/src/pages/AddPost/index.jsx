import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useNavigate, Navigate, useParams, } from 'react-router-dom';
import axios from '../../axios' 

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slice/auth';

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth)
  const navigate = useNavigate()
  
  const {id} = useParams()
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags]   = React.useState('');
  const [imageUrl, setImageUrl]   = React.useState('');
  const inputFileRef = React.useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/uploads', formData)
      setImageUrl(data.url)
    }catch(err){
      console.warm(err)
      alert("Ֆայլի վերբեռման սխալ․․․")
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const fields = {
        title,
        text,
        imageUrl,
        tags:tags,
      }
      const { data } = isEditing
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields)
      
      const _id = isEditing 
      ? id
      : data._id
      
      navigate(`/posts/${_id}`)
    }catch(err){
      console.log(err)
      alert(err)
      alert("Չհաջողվեց հրապարակել․․․")
    }
  }

  const onChange = React.useCallback((value) => {
    setText(value);
  }, [])

  React.useEffect(async ()=>{
    if(id) {
       axios.get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title)
        setTags((data.tags).join(','))
        setText(data.text)
        setImageUrl(data.imageUrl)
      }).catch( err => {
        //alert(err)
        console.log("Error is: "+err)
      })
    }
  },[])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Ավելացրեք տեքստ...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={()=>{inputFileRef.current.click()}} variant="outlined" size="large">
        Բեռնել նկար
      </Button>
      <input 
        ref={inputFileRef}
        type="file" 
        onChange={handleChangeFile}
        hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Ջնջել
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Վերնագիր..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Տեգեր"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Պահպանել' : "Հրապարակել"}
        </Button>
        <a href="/">
          <Button size="large">Չեղարկել</Button>
        </a>
      </div>
    </Paper>
  );
};
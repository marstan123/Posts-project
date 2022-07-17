import React, { useState, useRef, useMemo, useEffect } from 'react';
import ClassCounter from './components/ClassCounter';
import Counter from './components/Counter'
import PostItem from './components/PostItem';
import PostList from './components/PostList';
import './styles/App.css';
import MyButton from './components/UI/button/MyButton';
import MyInput from './components/UI/input/MyInput';
import PostForm from './components/PostForm';
import MySelect from './components/UI/select/MySelect';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/MyModal/MyModal';
import { usePosts } from './hooks/usePosts';
import { useFetch } from './hooks/useFetch';
import axios from 'axios'
import PostService from './API/PostService';
import Loader from './components/UI/Loader/Loader';
import { getPageCount, getPagesArray } from './utils/pages';
import Pagination from './components/UI/Pagination/Pagination';


function Posts() {
  const [posts, setPosts] = useState([
    // {id: 1, title: 'JavaScript', body: 'Description'},
    // {id: 2, title: 'JavaScript 2', body: 'Description'},
    // {id: 3, title: 'JavaScript 3', body: 'Description'}
  ])

  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
  const [fetchPosts, isPostsLoading, postError] = useFetch(async () => {
    const response = await PostService.getAll(limit, page)
    setPosts(response.data)
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPageCount(totalCount, limit))
  })
  useEffect(() => {
    fetchPosts()
  }, [page])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setPage(page);
  }

  return (
    <div className="App">
      <MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
        Create User
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create = {createPost} />
      </MyModal>
      <hr style={{margin: '15px 0'}} />
      <PostFilter 
        filter={filter}
        setFilter={setFilter}
      />
      {postError &&
        <h1 style={{textAlign: 'center'}}>Oops, Error {postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
        : <PostList remove = {removePost} posts={sortedAndSearchedPosts} title = 'JS Posts'/>
      }
      <Pagination page={page} changePage={changePage} totalPages={totalPages}/>
    </div>
  );
}

export default Posts;

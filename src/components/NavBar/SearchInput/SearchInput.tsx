import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSearch } from '../../../redux/actions/getSearch';
import { AppDispatch, storeInterface } from '../../../redux/store';
import { GrHistory } from 'react-icons/gr';
import styles from './SearchInput.module.css';
import { deleteToSearch } from '../../../redux/actions/deleteToSearch';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const SearchInput: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const location = useLocation();

  const search_param = searchParams.get('search') || '';

  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const { allSearchs } = useSelector((state: storeInterface) => state.searchs);

  const [searchsFiltered, setSearchsFiltered] = useState(allSearchs);

  useEffect(() => {
    setSearch(search_param);
  }, [search_param]);

  useEffect(() => {
    setSearchsFiltered(
      allSearchs.filter((e: string) =>
        search.toLowerCase() === e.toLowerCase()
          ? null
          : e.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, allSearchs]);

  const handleInputChange = (ev: any) => {
    setSearch(ev.target.value);
  };

  const searchProduct = (ev: any) => {
    ev.preventDefault();
    location.pathname === '/admin'
      ? 
        navigate(`/admin?search=${search}&page=1`)
      : navigate(`/?search=${search}&page=1`);
  };

  const deleteSearchList = useCallback(() => {
    setSearchList(!searchList);
  }, [searchList]);

  useEffect(() => {
    if (searchList === true) {
      document.body.addEventListener('click', deleteSearchList);
    }
    return () => {
      document.body.removeEventListener('click', deleteSearchList);
    };
  }, [deleteSearchList, searchList]);

  const handleSetSearchList = () => {
    !searchList && setSearchList(true);
  };

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.keyCode === 40 || e.keyCode === 38) {
        // Lógica para la flecha hacia abajo o hacia arriba
        e.preventDefault();
        const direction = e.keyCode === 40 ? 1 : -1;
        const newIndex =
          (selectedItem === null
            ? 0
            : selectedItem + direction + allSearchs.length) % allSearchs.length;
        setSelectedItem(newIndex);
      }
    },
    [selectedItem, allSearchs]
  );

  useEffect(() => {
    !searchList && setSelectedItem(null);

    selectedItem != null && setSearchList(true);
    // Agrega un event listener para el evento keydown al montar el componente
    document.addEventListener('keydown', handleKeyDown);

    // Limpia el event listener al desmontar el componente
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, handleKeyDown, searchList]); // Vuelve a agregar el event listener si el ítem seleccionado cambia

  const handleMouseEnter = (index: number) => {
    setSelectedItem(index);
  };

  const handleClick = (item: string) => {
    setSearch(item);
  };

  const handleDeleteSearch = (
    ev: React.MouseEvent<HTMLButtonElement>,
    param: string
  ) => {
    ev.stopPropagation(); // Evitar la propagación del evento de click
    deleteToSearch(param);
    dispatch(getSearch());
    return false; // Evitar la propagación del evento de click
  };

  return (
    <div className={styles.inputContainer}>
      <form onSubmit={searchProduct}>
        <input
          className={styles.searchInput}
          type='text'
          placeholder='Search'
          value={search}
          onChange={handleInputChange}
          onClick={handleSetSearchList}
        />
      </form>
      {!searchsFiltered.length ? null : (
        <div
          style={{ display: !searchList ? 'none' : 'flex' }}
          className={styles.searchList}
        >
          <ul className={styles.searchs}>
            {searchsFiltered?.map((item: string, index: number) => (
              <li
                key={index}
                style={
                  index === selectedItem
                    ? { backgroundColor: 'rgb(206, 204, 204)' }
                    : undefined
                }
                onMouseEnter={() => handleMouseEnter(index)}
                // Agregando el manejador onMouseEnter
                onClick={() => handleClick(item)}
              >
                <div>
                  <GrHistory style={{ margin: '0px 10px' }} />
                  {item}
                </div>
                <button onClick={(ev) => handleDeleteSearch(ev, item)}>
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

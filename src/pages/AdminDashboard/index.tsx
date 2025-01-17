import React, { useCallback, useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, storeInterface } from '../../redux/store';
import { product } from '../../interfaces/product';
import DashboardProducts from '../../components/DashboardProducts/DashboardProducts';
import Loader from '../../components/Loader/Loader';
import Categories from '../../components/Categories/Categories';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { getAllProducts } from '../../redux/actions/getAllproducts';
import Loadingscreen from '../../components/LoadingScreen/Loadingscreen';
import { userId } from '../../redux/actions/userId';
import Pages from '../../components/ProductsGrid/Pages/Pages';
import { getAllcategory } from '../../redux/actions/getAllCategory';
import { category } from '../../interfaces/category';
import ToggleCreateCatgory from './ToggleCreateCategory/ToggleCreateCatgory';

const AdminDashboard: React.FC = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState('home');
  const [createCategory, setCreateCategory] = useState<boolean>(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') ?? '';

  const { User, userLoading } = useSelector(
    (state: storeInterface) => state.user
  );

  const { title, products, productsLoading, currentPage, deleting, message } =
    useSelector((state: storeInterface) => state.products);

  const { categories, categoriesLoading, changingCategory, categoriesError } =
    useSelector((state: storeInterface) => state.categories);

  const dispatch = useDispatch<AppDispatch>();

  const user = userId.get();

  useEffect(() => {
    if (!user?.length) {
      navigate('*');
    } // Si el usuario no está logueado lo redirige a otra pagina
  }, [user, navigate]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    dispatch(getAllcategory());
  }, [dispatch]);

  useEffect(() => {
    (page !== currentPage || search !== title) &&
      dispatch(getAllProducts({ page, title: search }));
  }, [dispatch, page, currentPage, search, title]);

  const createRedirect = () => {
    navigate('/create');
  };

  const toggleCreateCategory = useCallback(() => {
    setCreateCategory(!createCategory);
  }, [createCategory]);

  return (
    <>
      {createCategory && <ToggleCreateCatgory onClose={toggleCreateCategory} />}
      {(deleting || changingCategory) && (
        <div className={styles.deleting}>
          <Loader color='#fff' />
        </div>
      )}
      {userLoading ? (
        <Loadingscreen />
      ) : (
        User && (
          <div className={styles.container}>
            <ul className={styles.myTab} role='tablist'>
              <li className={styles.navItem}>
                <button
                  className={`${styles.navLink} ${
                    activeTab === 'home' && styles.active
                  }`}
                  onClick={() => handleTabClick('home')}
                  type='button'
                  role='tab'
                  aria-controls='home-tab-pane'
                  aria-selected={activeTab === 'home'}
                >
                  Products
                </button>
              </li>
              <li className={styles.navItem}>
                <button
                  className={`${styles.navLink} ${
                    activeTab === 'profile' && styles.active
                  }`}
                  onClick={() => handleTabClick('profile')}
                  type='button'
                  role='tab'
                  aria-controls='profile-tab-pane'
                  aria-selected={activeTab === 'profile'}
                >
                  Categories
                </button>
              </li>
            </ul>
            <div className={styles.myTabContent}>
              <div
                className={`${styles.tabPane} ${
                  activeTab === 'home' && styles.active
                }`}
                role='tabpanel'
              >
                <button
                  className={styles.create_button}
                  onClick={createRedirect}
                >
                  Add product
                </button>
                <hr />
                {currentPage && <Pages />}
                {message && <ErrorMessage message={message} />}
                {productsLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '550px'
                    }}
                  >
                    <Loader color='#333' />
                  </div>
                ) : (
                  products?.map((p: product, index: number) => (
                    <DashboardProducts
                      key={index}
                      _id={p._id}
                      image={p.image}
                      title={p.title}
                      price={p.price}
                    />
                  ))
                )}
                {currentPage && <Pages />}
              </div>
              <div
                className={`${styles.tabPane} ${
                  activeTab === 'profile' && styles.active
                }`}
                role='tabpanel'
              >
                <button
                  className={styles.create_button}
                  onClick={toggleCreateCategory}
                >
                  Add category
                </button>
                {categoriesError ? (
                  <ErrorMessage message={categoriesError.text} />
                ) : null}
                <hr />
                {categoriesLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Loader color='#333' />
                  </div>
                ) : (
                  <>
                    {categories?.map((c: category) => (
                      <Categories key={c._id} _id={c._id} name={c.name} />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default AdminDashboard;

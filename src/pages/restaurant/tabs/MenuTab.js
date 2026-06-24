import React from 'react';

const MenuTab = ({ menus }) => {
    if (!menus || menus.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>메뉴</h3>
                <div style={styles.emptyBox}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍽️</div>
                    <p style={{ color: '#666', fontSize: '16px' }}>등록된 메뉴가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>메뉴</h3>
            <div style={styles.list}>
                {menus.map((menu, index) => (
                    <div key={menu.menuIdx}>
                        <div style={styles.row}>
                            {menu.imageUrl && (
                                <img src={menu.imageUrl} alt={menu.menuName} style={styles.thumb} />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={styles.name}>{menu.menuName}</div>
                            </div>
                            <div style={styles.price}>
                                {menu.menuPrice.toLocaleString()}원
                            </div>
                        </div>
                        {index < menus.length - 1 && <div style={styles.divider} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    emptyBox: {
        border: '2px solid #ddd', borderRadius: '8px',
        padding: '40px', backgroundColor: '#fff'
    },
    list: {
        border: '1px solid #e0e0e0', borderRadius: '8px',
        padding: '10px 20px', backgroundColor: '#fff'
    },
    row: {
        display: 'flex', alignItems: 'center',
        padding: '15px 0', gap: '15px'
    },
    thumb: {
        width: '60px', height: '60px',
        borderRadius: '8px', objectFit: 'cover'
    },
    name: { fontSize: '16px', color: '#333', fontWeight: '500' },
    price: { fontSize: '16px', color: '#007bff', fontWeight: 'bold', whiteSpace: 'nowrap' },
    divider: { borderBottom: '1px solid #f0f0f0' },
};

export default MenuTab;

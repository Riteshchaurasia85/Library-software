    const tabs =
document.querySelectorAll('.tab');

function showSection(section){

    // HIDE ALL

    document.getElementById(
    'courses-section'
    ).style.display = 'none';

    document.getElementById(
    'books-section'
    ).style.display = 'none';

    document.getElementById(
    'papers-section'
    ).style.display = 'none';

    // SHOW SELECTED

    if(section === 'courses'){

        document.getElementById(
        'courses-section'
        ).style.display = 'block';
    }

    if(section === 'books'){

        document.getElementById(
        'books-section'
        ).style.display = 'block';
    }

    if(section === 'papers'){

        document.getElementById(
        'papers-section'
        ).style.display = 'block';
    }

    // ACTIVE TAB

    tabs.forEach(tab => {

        tab.classList.remove(
        'active'
        );

    });

    event.target.classList.add(
    'active'
    );
}
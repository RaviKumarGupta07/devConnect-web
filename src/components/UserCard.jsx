const UserCard = ({ user }) => {
    if (!user) return;
    const { firstName, lastName, photoURL, age, about, gender, skills } = user;
    return (
        <>
            <div className="card bg-base-300 my-4 w-96 shadow-sm">
                <figure>
                    <img
                        src={photoURL}
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{firstName} {lastName}</h2>
                    <h3>
                        <span>{age}y </span>
                        <span>{gender}</span>
                    </h3>
                    <div className="flex flex-row gap-3">
                        <h3 className="badge badge-secondary shrink-0">skills : </h3>
                        <ul className="flex flex-wrap gap-2">{skills.map(skill => {
                            return <li key={skill} className="badge badge-accent">{skill} </li>
                        })}
                        </ul>
                    </div>
                    <p>{about}</p>
                    <div className="card-actions justify-between">
                        <button className="btn btn-secondary">Ignore</button>
                        <button className="btn btn-primary">Show Interest</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard;
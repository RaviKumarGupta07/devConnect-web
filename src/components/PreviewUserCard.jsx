const PreviewUserCard = ({ user }) => {
    if (!user) return;
    const { firstName, lastName, photoURL, age, about, gender, skillsInput } = user;
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
                        {age && <span>{age}y </span>}
                        {gender && <span>{gender}</span>}
                    </h3>
                    <div className="flex flex-row gap-3">
                        {skillsInput && (
                            <>
                                <h3 className="badge badge-secondary shrink-0">skills : </h3>
                                <p className="badge badge-accent min-w-0 h-auto">{skillsInput}</p>
                            </>)}
                    </div>
                    <p>{about}</p>
                </div>
            </div>
        </>
    )
}

export default PreviewUserCard;
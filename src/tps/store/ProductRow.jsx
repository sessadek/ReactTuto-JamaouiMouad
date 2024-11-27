export default function ProductRow ({product}) {
    return <tr className="align-middle">
        <td>{product.id}</td>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>{product.description.length > 250 ? product.description.slice(0, 250) + '...' : product.description}</td>
        <td>{product.category}</td>
        <td><img className="img-thumbnail" src={product.image} alt={product.title} srcSet="" /></td>
        <td><span className="badge text-bg-primary">{product.rating.rate} / {product.rating.count}</span></td>
    </tr>
}
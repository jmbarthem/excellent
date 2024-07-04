<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProdutoImagem;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = ['descricao', 'valor_venda', 'estoque'];

    public function imagens()
    {
        return $this->hasMany(ProdutoImagem::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_produto')
                    ->withPivot('quantidade', 'preco_unitario', 'subtotal')
                    ->withTimestamps();
    }
}

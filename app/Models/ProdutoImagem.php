<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdutoImagem extends Model
{
    use HasFactory;

    protected $table = 'produto_imagens';

    protected $fillable = ['produto_id', 'path'];

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
}

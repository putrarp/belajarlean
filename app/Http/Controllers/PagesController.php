<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagesController extends Controller
{
    public function index(){
        return view('pages.welcome');
    }
    public function training(){
        $data = array(
            'training' => ['Lean', 'TPM', 'Six Sigma']
        );
        return view('pages.training')->with($data);
    }

    public function lean(){
        return view('pages.lean');
    }

    public function kanboard(){
        return view('kanboard');
    }
}
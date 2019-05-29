function add_surce(x, s) {
    for (let i = 0; i < x.length; i++) {
        x[i] += s[i]*dt;
    }
}

function diffuse(x, x0, b) {
    let a = dt*diff;

    for (let k = 0; k < 20; k++) {
        for (let i = 1; i < N-1; i++) {
            for (let j = 1; j < N-1; j++) {
                x[idx(i,j)] = (x0[idx(i,j)] + a*(x[idx(i-1,j)]
                    +x[idx(i+1,j)]+x[idx(i,j-1)]+x[idx(i,j+1)]))/(1+4*a);
            }
        }
        set_bnd(x, b);
    }
}

function advect(d, d0, u, v, b) {
    let i0, i1, j0, j1;
    let s0, s1, t0, t1;
    let x, y;

    let dt0 = dt*N;

    for (let i = 1; i < N-1; i++) {
        for (let j = 1; j < N-1; j++) {
            x = i-dt0*u[idx(i,j)];
            y = j-dt0*v[idx(i,j)];

            if (x<0.5) x = .5; 
            if (x>N-1.5) x = N-1.5;
            if (y<0.5) y = .5; 
            if (y>N-1.5) y = N-1.5;
            i0 = Math.floor(x); i1=i0+1;
            j0 = Math.floor(y); j1=j0+1;

            s1 = x-i0; s0 = 1-s1;
            t1 = y-j0; t0 = 1-t1;

            d[idx(i,j)] = s0*(t0*d0[idx(i0,j0)]+t1*d0[idx(i0,j1)])
                +s1*(t0*d0[idx(i1,j0)]+t1*d0[idx(i1,j1)]);
        }
    }
    set_bnd(d, b);
}

function project(u, v) {
    let h = 1/N;
    let div = [];
    let p = [];

    for (let i = 1; i < N-1; i++) {
        for (let j = 1; j < N-1; j++) {
            div[idx(i,j)] = -0.5 * h *
                (u[idx(i+1,j)]-u[idx(i-1,j)]+v[idx(i,j+1)]-v[idx(i,j-1)]);
            p[idx(i,j)] = 0;
        }
    }
    set_bnd(div); set_bnd(p);

    for (let k = 0; k < 20; k++) {
        for (let i = 1; i < N-1; i++) {
            for (let j = 1; j < N-1; j++) {
                p[idx(i,j)] = (div[idx(i,j)]+
                    p[idx(i-1,j)]+p[idx(i+1,j)]+p[idx(i,j-1)]+p[idx(i,j+1)])/4;
            }
        }
        set_bnd(p);
    }

    for (let i = 1; i < N-1; i++) {
        for (let j = 1; j < N-1; j++) {
            u[idx(i,j)] -= 0.5 * (p[idx(i+1,j)]-p[idx(i-1,j)])/h;
            v[idx(i,j)] -= 0.5 * (p[idx(i,j+1)]-p[idx(i,j-1)])/h;
        }
    }
    set_bnd(u, 1); set_bnd(v, 2);
}

function dim(d) {
    let k = Math.pow(0.9,(1/frame_rate));
    for (let i = 0; i < d.length; i++) {
        d[i] *= k;
    }
}

function set_bnd(x, b=0) {
    // for (let i = 0; i < N; i++) {
    //     x[idx(i,0)] = 0;
    //     x[idx(i,N-1)] = 0;
    //     x[idx(0,i)] = 0;
    //     x[idx(N-1,i)] = 0;
    // }
    for (let i = 0; i < N; i++) {
        x[idx(i,0)] = (b==2 ? -x[idx(i,1)] : x[idx(i,1)]);
        x[idx(i,N-1)] = (b==2 ? -x[idx(i,N-2)] : x[idx(i,N-2)]);
        x[idx(0,i)] = (b==1 ? -x[idx(1,i)] : x[idx(1,i)]);
        x[idx(N-1,i)] = (b==1 ? -x[idx(N-2,i)] : x[idx(N-2,i)]);
    }
    x[idx(0,0)] = (x[idx(0,1)]+x[idx(1,0)])/2
    x[idx(0,N-1)] = (x[idx(0,N-2)]+x[idx(1,N-1)])/2
    x[idx(N-1,0)] = (x[idx(N-1,1)]+x[idx(N-2,0)])/2
    x[idx(N-1,N-1)] = (x[idx(N-1,N-2)]+x[idx(N-2,N-1)])/2
}

function empty_array(n, val=0){
    let l = [];
    for (let i = 0; i < n; i++) {
        l[i] = val;
    }
    return l;
}

